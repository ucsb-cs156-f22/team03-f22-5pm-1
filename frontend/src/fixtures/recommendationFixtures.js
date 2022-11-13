const recommendationFixtures = {
    oneRecommendation: {
        "id": 1,
        "requesterEmail": "cgaucho@ucsb.edu",
        "professorEmail": "deanprofessor@ucsb.edu",
        "explanation": "Recommendation needed for grad school",
        "dateRequested": "2022-11-10T07:05:32",
        "dateNeeded": "2022-12-31T00:00:00",
        "done": false,
    },
    threeRecommendations: [
        {
            "id": 1,
            "requesterEmail": "bob@burgers.com",
            "professorEmail": "linda@burgers.com",
            "explanation": "Recommendation for burger loan",
            "dateRequested": "2022-08-15T13:15:09",
            "dateNeeded": "2022-10-10T17:00:00",
            "done": true,
        },
        {
            "id": 2,
            "requesterEmail": "shinji@eva.edu",
            "professorEmail": "gendo@eva.edu",
            "explanation": "Please don't make me get in the EVA",
            "dateRequested": "2015-06-06T06:06:06",
            "dateNeeded": "2015-06-06T07:07:07",
            "done": false,
        },
        {
            "id": 3,
            "requesterEmail": "robin@wayne.com",
            "professorEmail": "bruce@wayne.com",
            "explanation": "Justice league application",
            "dateRequested": "1992-10-31T00:00:01",
            "dateNeeded": "1992-11-30T11:59:59",
            "done": true,
        }
    ]
}

export { recommendationFixtures };