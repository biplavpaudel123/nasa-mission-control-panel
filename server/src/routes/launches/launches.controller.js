const {  existsLaunchWithID,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,} = require('../../models/launches.model');

const {getPagination}=require('../../services/query')

async function httpGetAllLaunches(req, res) {
    console.log(req.query);
    const {skip, limit}= getPagination(req.query);
    const launches= await getAllLaunches(skip,limit);
    return res.status(200).json(launches);
}

async function httpPostLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid Launch Date',
        });
    }
    await addNewLaunch(launch);
    return res.status(201).json(launch);
}
async function httpAbortLaunch(req, res) {
    const launchId = +req.params.id;
    if(! await existsLaunchWithID(launchId)){
        return res.status(404).json({
            error: "Launch not found",
        })
    }

    // if found
    const aborted= await abortLaunchById(launchId);
    return res.status(200).json(aborted);
}


module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpAbortLaunch,
}