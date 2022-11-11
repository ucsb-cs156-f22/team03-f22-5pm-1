const HelpRequestsFixtures = {
    oneHelpRequests: {
        "id": 1,
        "requesterEmail": "groot@gmail.com",
        "teamId": "groot",
        "tableOrBreakoutRoom": "table",
        "explanation": "I'm groot!",
        "solved": true,
        "requestTime": "2022-01-02T12:00:00"
    },
    threeHelpRequests: [
        {   
            "id": 1,
            "requesterEmail": "groot@gmail.com",
            "teamId": "groot",
            "tableOrBreakoutRoom": "table",
            "explanation": "I'm groot!",
            "solved": true,
            "requestTime": "2022-01-02T12:00:00"
        },
        {   
            "id": 2,
            "requesterEmail": "AAA@gmail.com",
            "teamId": "AABBCC",
            "tableOrBreakoutRoom": "table",
            "explanation": "I'm AAA!",
            "solved": false,
            "requestTime": "2012-01-02T12:00:00"
        },
        {
            "id": 3,
            "requesterEmail": "batman@gmail.com",
            "teamId": "bat",
            "tableOrBreakoutRoom": "breakoutroom",
            "explanation": "I'm batman!",
            "solved": false,
            "requestTime": "2022-03-02T12:00:00"
        } 
    ]
};


export { HelpRequestsFixtures };