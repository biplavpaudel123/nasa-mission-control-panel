const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => { //Describing a test fixture
    test('It should respond with 200 success', async () => {
         await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 17',
        target: 'Kepler-186 f',
        launchDate: 'January 4,2028'
    };
    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 17',
        target: 'Kepler-186 f',
    };
    test('It should respond with 201 success', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf(); //Converting the string date to date type using Date constructor and checking the valueOf() for matching Unix timestamps. 
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate)
    });
    test('It should catch missiing required property', async () => {
             const response=await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

    expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
    });
    })
    test('It should catch invalid dates', async () => {
            const response= await request(app)
            .post('/launches')
            .send({ ...launchDataWithoutDate, 'launchDate': 'Fake date' })
            .expect(401)

       expect(response.body).toStrictEqual({
        error: 'Invalid Launch Date',
    });
    })
});

//The describe,expect,test are not js functions. Jest know where to find these functions when we run test command.