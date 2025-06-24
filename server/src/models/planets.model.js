const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,'../','../','data','kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true
      }))
      .on('data',async (data) => {
        if (isHabitablePlanet(data)) {
          //there is a problem here. when we run a cluster server everytime the server.js file runs and the loadplanets data executes, which make the duplicacy of the data. For that we use the upsert operation.
          // await planets.updateOne({ 
          //   kepler_name:data.kelper_name,
          // })
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const length = (await getAllPlanets()).length;
        console.log(`${length} habitable planets found!`);
        resolve();
      });
    
  });
};

async function savePlanet(planet) {
    await planets.updateOne({ 
            kepler_name:planet.kepler_name,
          },{
            kepler_name:planet.kepler_name,
          },{
            upsert:true,
          })
}

async function getAllPlanets(){
  return await planets.find({});
} 

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}