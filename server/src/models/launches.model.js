const launches = new Map();

const launch={
    flightnumber: 100,
    launchDate: new Date('December 27,2030'),
    mission: 'Kelper Exploration X',
    rocket:'Explorer IS1',
    target:'Kelper-442b',
    customer: ['ZTM','NASA'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightnumber,launch)

function getAllLaunches(){
    return Array.from(launches.values());
}

module.exports={
 getAllLaunches
}
