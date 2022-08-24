const router = require("express").Router();
const reclamationCtr = require("../controllers/reclamation");

router.post("/add", reclamationCtr.addReclamation);
router.get("/getAll", reclamationCtr.getAllReclamations);
router.get("/BarChartData", reclamationCtr.BarChartData);
router.get("/getTotalObservable", reclamationCtr.getTotalObservable);
router.get("/getTotalRelationShip", reclamationCtr.getTotalRelationShip);
router.get("/getTotalReports", reclamationCtr.getTotalReports);
router.get("/lineChartData", reclamationCtr.lineChartData);
router.get("/radarChartData", reclamationCtr.radarChartData);
router.get("/threadReport", reclamationCtr.threadReport);
router.get("/getTotalEntities", reclamationCtr.getTotalEntities);

module.exports = router;
