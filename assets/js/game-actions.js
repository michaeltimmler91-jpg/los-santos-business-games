const GAME_ACTIONS = [

    {
        id:"taxi_drive",
        title:"Fahrt abgeschlossen",
        pointsMin:5,
        pointsMax:15,
        energyCost:15,
        cooldown:30
    },

    {
        id:"taxi_delivery",
        title:"Lieferung abgeschlossen",
        pointsMin:10,
        pointsMax:25,
        energyCost:25,
        cooldown:60
    },

    {
        id:"md_patient",
        title:"Patient behandelt",
        pointsMin:8,
        pointsMax:18,
        energyCost:20,
        cooldown:45
    },

    {
        id:"pd_patrol",
        title:"Streife beendet",
        pointsMin:6,
        pointsMax:14,
        energyCost:15,
        cooldown:40
    },

    {
        id:"workshop_repair",
        title:"Fahrzeug repariert",
        pointsMin:7,
        pointsMax:20,
        energyCost:20,
        cooldown:50
    }

];