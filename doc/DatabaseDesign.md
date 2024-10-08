# Database Design

## ER Diagram
![image](https://github.com/user-attachments/assets/7bacff2e-887d-4cc5-a653-42e2ebb8681c)

## Assumptions
Users is modeled as an entity to store all user information, including username and email, with username (which will require distinctness) as the primary key to uniquely identify each individual.

Recreation is modeled as entity to store all recreational locations with RecName as a primary key to identify each recreation uniquely. StateName is set as a foreign key to reference the States relation.

States was modeled as a separate entity instead of within the recreation entity to reduce redundancy, since many tuples would have the same state in the recreation entity, with StateName as the primary key to uniquely identify states. Similarly, the favorites entity was modeled separate from the users entity to avoid redundancy with identical favorited recreation among several users. Favorites is modeled as an entity to store a bank of favorited recreation users want to save for later, with Username as a primary key to uniquely identify each favorite. Username and RecName is set as foreign keys to reference the Users and Recreation entities, respectively.

Discounts is modeled as an entity to store all possible discounts, with DiscountId as the primary key to uniquely identify each discount and RecName as a foreign key to reference the Recreation relation.

Comments is modeled as entity to store all user comments with CommentId as a primary key to identify each comment uniquely. Username and RecName is set as foreign keys to reference the Users and Recreation entities, respectively.

---------------

Discounts and recreation have a many-to-many relation, since a feature such as a veteran discount can be applicable to more than one recreation and vice versa - one recreation can have multiple discounts such as having both a veteran discount and a student discount. One recreation is allowed exactly one state, since there is only one location, though one state (location) can have many recreational activities.

One comment is only allowed one recreation, since a user’s message cannot be applied to multiple recreational activities; this can also minimize fake reviews. One recreation is allowed 0 or more comments, to allow for a variety of user comments. Similarly, one user can leave multiple comments for various recreation but one comment can only be contributed by one user. 

One favorite by a user can only have one recreation (there can be multiple rows with same user but not one row with multiple recreation), while one recreation can be favorited by multiple users. With similar logic, for the “likes” relation - one user can have multiple favorites, but one favorite can only have exactly one user.

## Normalization - 3NF Decomposition

**Relations from ER Diagram**

```
Users(Username, Email)
Favorites(Username, RecName, Status)
Discounts(DiscountId, RecName, DiscountType, Eligibility, Description)
Recreation(RecName, RecType, State, Address)
States(StateName, CityCount, Region, TotalArea, Population)
Comments(CommentId, Username, RecName, Comment, DatePosted)
```

**Functional Dependencies**
```
DiscountId → (RecName, DiscountType, Description, Eligibility)
RecName → (RecType, StateName, Address) 
Username, RecName → Status 
Username → Email 
CommentId → (Username, RecName, DatePosted, Comment) 
StateName → (CityCount, Population, TotalArea, Region)
```

| Left | Middle | Right | None |
| ---- | ---- | ---- | ---- |
| DiscountId | RecName | Description |  |
| CommentId | Username | Eligibility |  |
|  | StateName | Status |  |
|  |  | DatePosted |  |
|  |  | Comment |  |
|  |  | Population |  |
|  |  | TotalArea |  |
|  |  | Region |  |
|  |  | RecType |  |
|  |  | Address |  |
|  |  | DiscountType |  |
|  |  | CityCount |  | 
|  |  | Email |  | 


1. Identifying Candidate Keys
```
(DiscountId, CommentId)+ = {DiscountId, CommentId, Username, RecName, DatePosted, Comment, DiscountType, Status, Description, Eligibility, RecType, StateName, Address, Email, CityCount, Population, TotalArea, Region}
```

2. Computing Minimal Basis for Functional Dependencies

**Singleton RHS**
```
DiscountId → RecName
DiscountId → DiscountType
DiscountId →  Description
DiscountId →  Eligibility
RecName → StateName
RecName → RecType
RecName → Address
Username, RecName → Status 
Username → Email 
CommentId → Comment 
CommentId → DatePosted
CommentId → Username
CommentId → RecName
StateName → CityCount
StateName → Population
StateName → TotalArea
StateName → Region
```

**Removing Unnecessary Attributes - LHS**
```
Username, RecName → Status
```
Username+ = {Username, Email}</br>
RecName+ = {RecName, RecType, StateName, Address, CityCount, Population, TotalArea, Region}

- Unable to remove attributes since attribute closure does not reach RHS without the selected dependency.

4. Final Relations
```
A(Username, Email)
B(Username, RecName, Status)
C(DiscountId, RecName, DiscountType, Eligibility, Description)
D(RecName, RecType, StateName, Address)
E(StateName, CityCount, Population, TotalArea, Region)
F(CommentId, Username, RecName, DatePosted, Comment)
```
## Relational Schema
```
Users (
  Username: VARCHAR(255) [PK],
  Email: VARCHAR(255)
)

Favorites (
  Username: VARCHAR(255) [PK] [FK to Users.Username],
  RecName: VARCHAR(255) [FK to Recreation.RecName],
  Status: BOOLEAN
)

Discounts(
  DiscountId: VARCHAR(255) [PK],
  RecName: VARCHAR(255) [FK.Recreation.RecName],
  DiscountType: VARCHAR(255),
  Eligibility: VARCHAR(255),
  Description: VARCHAR(255)
)

Recreation (
  RecName: VARCHAR(255) [PK],
  RecType: VARCHAR(15),
  StateName: VARCHAR(2) [FK.States.StateName],
  Address: VARCHAR(255)
)

States  (
  StateName: VARCHAR(2) [PK],
  CityCount: INT,
  Region: VARCHAR(255),
  TotalArea: REAL,
  Population: INT
)

Comments (
  CommentId: REAL [PK],
  Username: VARCHAR(255) [FK to Users.Username],
  RecName: VARCHAR(255) [FK to Recreation.RecName],
  Comment: VARCHAR(255),
  DatePosted:VARCHAR(255)
)
```
