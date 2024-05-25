# FanCodeService

```
Service Description:
This service is a backend for a sports app.
It has 3 entities - Sport, Tour and Match.
Each sport has multiple tours and each tour has multiple matches.

------------------------------------------------------------------------------------------------------------------------

Problem 1
Endpoint /tour/matches returns all the matches for a given tour name.
The endpoint latency increases linearly with the number of tours. Modify the endpoint to increase the performance.

Problem 2
Modify the endpoint /sport/tour/match to also return match's id, startTime and format

Problem 3
Requirement: News Support for Matches and Tours
Functional Requirements:
    1. News can be created for a match or a tour.
    2. Each news created for a match also belongs to the corresponding tour.
    3. Each news created for a tour also belongs to the corresponding sport.
Technical Requirements:
    1. Create an endpoint to create news.
    2. Create an endpoint to fetch news by match id
    3. Create an endpoint to fetch news by tour id
    4. Create an endpoint to fetch news by sport id
News Model
{
    title: string,
    description: string
}
```

## Solution Approach 

### Problem 1
>Endpoint /tour/matches returns all the matches for a given tour name.

Approach - I updated the SQL query to return all the fields from the 'Match' table and 'Tour.name' from 'Tour' table using left join.

>The endpoint latency increases linearly with the number of tours. Modify the endpoint to increase the performance.

Approach - These are the approaches I will follow to solve the latency issue.
- I will use the concept of 'Indexing' here to achieve a better result from get query for the above endpoints, I made two indexes
```
CREATE INDEX idx_tours_name ON mydb.tours(name);
CREATE INDEX idx_matches_tourId ON mydb.matches(tourId);
```
- I will use 'Pagination' add to limit the number of rows returned.
```
I used page and size in the endpoint '/tour/matches' to limit the result. A final endpoint will be-
End point - /tour/matches?name=?&size=?&page=?
```
- We can also increase latency by adding 'Caching' functionality in our service over the most requesting endpoints.


### Problem 2

>Modify the endpoint /sport/tour/match to also return match's id, startTime and format

Approach - I updated the SQL query added ('startTime' and 'fomat') and did Inner joins over tours and sports.

### Problem 3

>Requirement: News Support for Matches and Tours
Functional Requirements:
>- News can be created for a match or a tour.
>- Each news created for a match also belongs to the corresponding tour.
>- Each news created for a tour also belongs to the corresponding sport.

Approach - 
* I made a new Table 'news' in db with {'title', 'description', 'matchId', 'tourId', 'sportId'} fields
  * I made 'matchId' to accept null. If no 'matchId' is given in req body.
  * 'title' and 'description' are mandatory for all requests.
* I made two cases for Create News given below-
  * Assumption 1 - If I get only 'matchId' in the req body, then I will find the corresponding 'tourId' and 'sportId' in the backend service.
    ```
    {
      "title":"The Match between LSG vs KXIP",
      "description":" That was a best Match Ever",
      "matchId":3
    }
    ```
  * Assumption 2 - If I get only 'tourId' in the req body, then I will find the corresponding 'sportId' in the backend service.
    ```
    {
      "title":"The Match between LSG vs KXIP",
      "description":" That was a best Match Ever",
      "tourId":3
    }
    ```

  * If we get everything in a single req body then there is no problem, we can directly store the news data in the News table
    ```
    {
      "title":"The Match between LSG vs KXIP",
      "description":" That was a best Match Ever",
      "matchId":1,
      "tourId":1,
      "sportId":1
    }
    ```

## Example Solutions

#### Request end point

### Problem 1

`GET /tour/matches?name=?&size=?&page=?`
  
    curl --location 'http://localhost:3000/tour/matches?name=English%20Premier%20League%2C%202022&size=4&page=1'

### Response
```
{
  "data": [
  {
    "matches.id": 11,
    "matches.name": "KER vs JFC",
    "matches.tourId": 4,
    "matches.status": 1,
    "matches.format": "soccer",
    "matches.startTime": "2022-04-09T18:00:00.000Z",
    "matches.endTime": "2022-04-09T23:00:00.000Z",
    "matches.recUpdatedAt": "2024-05-25T10:15:18.000Z",
    "matches.createdAt": "2024-05-25T10:15:18.000Z",
    "tours.name": "English Premier League, 2022"
  }
],
"meta": {
  "total": 1,
  "page": 1,
  "size": 4
}
}
```

### Problem 2

`GET /sport/tour/match`
      
    curl --location 'http://localhost:3000/sport/tour/match'

### Response

```
{
    "Cricket": {
        "India Tour of West Indies, 2023": [
            {
              "id": 8,
              "name": "IND vs WI",
              "startTime": "2023-06-10T10:00:00.000Z",
              "format": "ODI"
            },
            {
              "id": 9,
              "name": "IND vs WI",
              "startTime": "2023-06-12T10:00:00.000Z",
              "format": "ODI"
            },
            {
              "id": 10,
              "name": "IND vs WI",
              "startTime": "2023-06-14T10:00:00.000Z",
              "format": "ODI"
            }
        ],
        "Indian Premier League, 2023": [
            {
                "id": 1,
                "name": "GT vs RCB",
                "startTime": "2023-04-09T18:00:00.000Z",
                "format": "T20"
              },
            {
              "id": 2,
              "name": "CSK vs MI",
              "startTime": "2023-04-10T18:00:00.000Z",
              "format": "T20"
            },
            {
              "id": 3,
              "name": "LSG vs KXIP",
              "startTime": "2023-04-11T18:00:00.000Z",
              "format": "T20"
            },
            {
              "id": 4,
              "name": "RR vs SRH",
              "startTime": "2023-04-12T18:00:00.000Z",
              "format": "T20"
            }
        ]
    },
    "Football": {
        "English Premier League, 2022": [
            {
              "id": 11,
              "name": "KER vs JFC",
              "startTime": "2022-04-09T18:00:00.000Z",
              "format": "soccer"
            }
        ],
        "India Super League, 2023": [
            {
              "id": 5,
              "name": "BLR vs BEN",
              "startTime": "2023-04-29T18:00:00.000Z",
              "format": "soccer"
            },
            {
              "id": 6,
              "name": "ATK vs MCFC",
              "startTime": "2023-04-21T18:00:00.000Z",
              "format": "soccer"
            },
            {
              "id": 7,
              "name": "KER vs JFC",
              "startTime": "2023-04-22T18:00:00.000Z",
              "format": "soccer"
            }
        ]
    }
}
```

### Problem 3

## Create a new News with 'matchId'

`POST /news`

    curl --location 'http://localhost:3000/news' \
    --header 'Content-Type: application/json' \
    --data '{
      "title":"The Match between LSG vs KXIP",
      "description":" That was a best Match Ever",
      "matchId":3
    }'

### Response
```
{
    "id": 6,
    "title": "The Match between LSG vs KXIP",
    "description": " That was a best Match Ever",
    "matchId": 1,
    "tourId": 1,
    "sportId": 1,
    "recUpdatedAt": "2024-05-25T11:36:41.000Z",
    "createdAt": "2024-05-25T11:36:41.000Z"
}
```

## Create a new News with 'tourId'

`POST /news`

    curl --location 'http://localhost:3000/news' \
    --header 'Content-Type: application/json' \
    --data '{
      "title":"The Match between LSG vs KXIP",
      "description":" That was a best Match Ever",
      "tourId":3
    }'

### Response
```
{
    "id": 6,
    "title": "The Match between LSG vs KXIP",
    "description": " That was a best Match Ever",
    "matchId": null,
    "tourId": 3,
    "sportId": 1,
    "recUpdatedAt": "2024-05-25T11:36:41.000Z",
    "createdAt": "2024-05-25T11:36:41.000Z"
}
```


## Create an endpoint to fetch news by match id

`GET /news/match/:matchId`

    curl --location 'http://localhost:3000/news/match/1'

### Response
```
[
    {
        "id": 1,
        "title": "Exciting Match Between GT and RCB",
        "description": "Details about the match...",
        "matchId": 1,
        "tourId": 1,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:15:18.000Z",
        "createdAt": "2024-05-25T10:15:18.000Z"
    }
]
```
## Create an endpoint to fetch news by tour id

`GET /news/tour/:tourId`

    curl --location 'http://localhost:3000/news/tour/1'


### Response
```
[
    {
        "id": 2,
        "title": "IPL 2023 Overview",
        "description": "A summary of the Indian Premier League 2023...",
        "matchId": null,
        "tourId": 1,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:15:18.000Z",
        "createdAt": "2024-05-25T10:15:18.000Z"
    },
    {
        "id": 5,
        "title": "The Match between LSG vs KXIP",
        "description": " That was a best Match Ever",
        "matchId": null,
        "tourId": 1,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:31:21.000Z",
        "createdAt": "2024-05-25T10:31:21.000Z"
    }
]
```

## Create an endpoint to fetch news by sport id

`GET /news/sport/:sportId`

    curl --location 'http://localhost:3000/news/sport/1'

### Response
```
[
    {
        "id": 1,
        "title": "Exciting Match Between GT and RCB",
        "description": "Details about the match...",
        "matchId": 1,
        "tourId": 1,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:15:18.000Z",
        "createdAt": "2024-05-25T10:15:18.000Z"
    },
    {
        "id": 2,
        "title": "IPL 2023 Overview",
        "description": "A summary of the Indian Premier League 2023...",
        "matchId": null,
        "tourId": 1,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:15:18.000Z",
        "createdAt": "2024-05-25T10:15:18.000Z"
    },
    {
        "id": 4,
        "title": "The Match between LSG vs KXIP",
        "description": " That was a best Match Ever",
        "matchId": null,
        "tourId": 3,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:16:40.000Z",
        "createdAt": "2024-05-25T10:16:40.000Z"
    },
    {
        "id": 5,
        "title": "The Match between LSG vs KXIP",
        "description": " That was a best Match Ever",
        "matchId": 3,
        "tourId": 1,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:31:21.000Z",
        "createdAt": "2024-05-25T10:31:21.000Z"
    },
    {
        "id": 6,
        "title": "The Match between LSG vs KXIP",
        "description": " That was a best Match Ever",
        "matchId": null,
        "tourId": 3,
        "sportId": 1,
        "recUpdatedAt": "2024-05-25T10:33:04.000Z",
        "createdAt": "2024-05-25T10:33:04.000Z"
    }
]
```


# Hurrey Done!!!!!
