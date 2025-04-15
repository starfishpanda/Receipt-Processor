# Receipt Processor

A simple REST API service that processes receipts and calculates points based on provided rules.

## API Endpoints

- `POST /receipts/process`: Submit a receipt for processing and get a unique ID
- `GET /receipts/{id}/points`: Get the points calculated for a receipt using its ID

## Technologies Used

- TypeScript
- Node.js
- Express.js
- UUID for generating unique IDs
- Docker

## Running the Application

### Prerequisites

- Docker installed on your system
- No need to configure environment variables

### Using Docker

1. Clone this repository
2. Navigate to the project directory
3. Build and run the Docker container:

```bash
# Build the Docker image
docker build -t receipt-processor .

# Run the container
docker run -p 3000:3000 receipt-processor
```

The API should now be accessible at http://localhost:3000

## Design Tradeoff Considerations

### 1. Point Calculation Timing

#### During Receipt Processing

**Pros:**

- Faster lookup of points when get requests are made
- Reduced computation if points for a receipt need to be looked up multiple times

**Cons:**

- If points calculation logic changes in the future, stored points need to be recalculated

#### At Get Request Time

**Pros:**

- Rule changes can be easily applied to older receipts
- Easier to handle bugs in point calculation logic without modifying stored data

**Cons:**

- Each get request takes longer as points are calculated on demand

#### Decision:

Store points at processing time because:

- Rules appear to be fixed
- Get requests will be faster, reducing repeat work
- Storage overhead for points data is minimal

### 2. Receipt ID Generation Approach

#### UUID

**Pros:**

- 128 bits offers plenty of space for receipt records
- Extremely low chance of collisions
- Can be generated independently across distributed systems
- No central coordination needed
- Works well in horizontally scaled architectures

**Cons:**

- Slightly larger storage requirements than sequential IDs
- Not naturally sortable by creation time (unless using UUID v1 or v7)

#### Counter/Sequential ID

**Pros:**

- Simple implementation and understanding
- Space efficient
- Naturally sortable by creation order
- Optimal for database indexing

**Cons:**

- Becomes a bottleneck in distributed systems
- Can leak business information (receipt volume, growth rate)
- More difficult to implement in distributed environments
- Risk of gaps if transactions are rolled back

#### Content Hash

**Pros:**

- Directly tied to receipt content (serves as a content fingerprint)
- Can detect duplicate receipts automatically
- Verifies receipt integrity

**Cons:**

- Collisions possible (though rare with strong hash algorithms)
- Any change to receipt content changes the ID
- Need to determine the "canonical" form of a receipt

#### Decision:

UUID is the most versatile, robust and scalable option, despite slightly larger storage requirements.

## Future Improvement Considerations

1. Parameterize point calculation rules to allow flexibility for future changes in points strategies.
2. Implement more thorough testing for receipt data format validation to ensure all necessary fields are present and correctly formatted and checking for edge cases of inputs.
