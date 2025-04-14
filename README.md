
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
1. Parameterize point calculation rules to allow flexibility for future changes
2. Implement more thorough receipt data format validation to ensure all necessary fields are present and correctly formatted