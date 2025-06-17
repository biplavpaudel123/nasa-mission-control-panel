const launches = new Map();

let latestFlightNumber= 100;

// const launch={
//     flightNumber: 100,
//     launchDate: new Date('December 27,2030'),
//     mission: 'Kelper Exploration X',
//     rocket:'Explorer IS1',
//     destination:'Kelper-442b',
//     customer: ['ZTM','NASA'],
//     upcoming: true,
//     success: true,
// };

function existsLaunchWithID(launchId){
    return launches.has(launchId);
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber,Object.assign(launch,{
        success: true,
        upcoming: true,
        customers: ['Biplav','Nasa'],
        flightNumber: latestFlightNumber,
    }));
}
function abortLaunchById(launchId){
    const aborted= launches.get(launchId);
    aborted.upcoming=false;
    aborted.success=false;
    return aborted;
}

module.exports={
    existsLaunchWithID,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}
