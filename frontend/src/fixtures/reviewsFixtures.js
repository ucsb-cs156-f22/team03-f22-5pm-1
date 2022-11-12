const reviewsFixtures = {
    oneReview: {
        "id": 1,
        "itemId" : 10,
        "reviewerEmail": "ethanlee@ucsb.edu",
        "stars": 3,
        "dateReviewed": "2022-01-02T12:00:00",
        "comments": "ok",
    },
    threeReview: [
        {
            "id": 1,
            "itemId" : 10,
            "reviewerEmail": "ethanlee@ucsb.edu",
            "stars": 3,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "ok",
        },
        {
            "id": 2,
            "itemId" : 5,
            "reviewerEmail": "lee@ethan.edu",
            "stars": 1,
            "dateReviewed": "2022-04-03T12:00:00",
            "comments": "horrible",
        },
        {
            "id": 3,
            "itemId" : 100,
            "reviewerEmail": "fake@notreal.edu",
            "stars": 5,
            "dateReviewed": "2022-07-04T12:00:00",
            "comments": "great",
        }
    ]
};


export { reviewsFixtures };