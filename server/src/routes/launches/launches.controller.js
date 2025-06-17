const {  existsLaunchWithID,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,} = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(401).json({
            error: 'Invalid Launch Date',
        });
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}
function httpAbortLaunch(req, res) {
    const launchId = +req.params.id;
    if(!existsLaunchWithID(launchId)){
        return res.status(404).json({
            error: "Launch not found",
        })
    }

    // if found
    const aborted= abortLaunchById(launchId);
    return res.status(200).json(aborted);
}


module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpAbortLaunch,
}