const Reclamation = require("../models/reclamationModel");
const axios = require("axios");

const url = "https://demo.opencti.io/graphql";
const header = {
  headers: {
    Authorization: `Bearer ${"c8f823c2-b99c-4854-9527-6fe512c68c05"}`,
  },
};
const reclamationCtrl = {
  getAllReclamations: async (req, res, next) => {
    try {
      const users = await Reclamation.find();
      res.status(200).json({
        success: true,
        users,
      });
    } catch (err) {
      next(err);
    }
  },

  addReclamation: async (req, res, next) => {
    try {
      const newRec = new Reclamation({
        ...req.body,
      });
      const reclamation = await newRec.save();
      return res.status(200).json({
        success: true,
        message: "reclamation added",
        reclamation,
      });
    } catch (err) {
      next(err);
    }
  },
  getTotalRelationShip: async (req, res, next) => {
    const body = {
      id: "DashboardStixCoreRelationshipsNumberQuery",
      query:
        "query DashboardStixCoreRelationshipsNumberQuery(\n  $type: String\n  $endDate: DateTime\n) {\n  stixCoreRelationshipsNumber(type: $type, endDate: $endDate) {\n    total\n    count\n  }\n}\n",
      variables: {
        type: "stix-core-relationship",
        endDate: "2022-07-29T13:53:22+01:00",
      },
    };

    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getTotalReports: async (req, res, next) => {
    const body = {
      id: "DashboardStixDomainObjectsNumberQuery",
      query:
        "query DashboardStixDomainObjectsNumberQuery(\n  $types: [String]\n  $endDate: DateTime\n) {\n  stixDomainObjectsNumber(types: $types, endDate: $endDate) {\n    total\n    count\n  }\n}\n",
      variables: {
        types: ["report"],
        endDate: "2022-07-29T13:53:22+01:00",
      },
    };

    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getTotalObservable: async (req, res, next) => {
    const body = {
      id: "DashboardStixCyberObservablesNumberQuery",
      query:
        "query DashboardStixCyberObservablesNumberQuery(\n  $types: [String]\n  $endDate: DateTime\n) {\n  stixCyberObservablesNumber(types: $types, endDate: $endDate) {\n    total\n    count\n  }\n}\n",
      variables: {
        types: null,
        endDate: "2022-07-29T13:53:22+01:00",
      },
    };

    return axios
      .post(url, body, header)
      .then((response) => {
        console.log("response", response.data);

        return res.status(200).json(response.data);
       
      })
      .catch((error) => {
        console.log(error);
      });
  },

  BarChartData: async (req, res, next) => {
    const body = {
      id: "StixCoreRelationshipsHorizontalBarsDistributionQuery",
      query:
        "query StixCoreRelationshipsHorizontalBarsDistributionQuery(\n  $relationship_type: String!\n  $toTypes: [String]\n  $field: String!\n  $operation: StatsOperation!\n  $startDate: DateTime\n  $endDate: DateTime\n  $dateAttribute: String\n  $limit: Int\n) {\n  stixCoreRelationshipsDistribution(relationship_type: $relationship_type, toTypes: $toTypes, field: $field, operation: $operation, startDate: $startDate, endDate: $endDate, dateAttribute: $dateAttribute, limit: $limit) {\n    label\n    value\n    entity {\n      __typename\n      ... on BasicObject {\n        __isBasicObject: __typename\n        entity_type\n      }\n      ... on BasicRelationship {\n        __isBasicRelationship: __typename\n        entity_type\n      }\n      ... on AttackPattern {\n        name\n        description\n        id\n      }\n      ... on Campaign {\n        name\n        description\n        id\n      }\n      ... on CourseOfAction {\n        name\n        description\n        id\n      }\n      ... on Individual {\n        name\n        description\n        id\n      }\n      ... on Organization {\n        name\n        description\n        id\n      }\n      ... on Sector {\n        name\n        description\n        id\n      }\n      ... on System {\n        name\n        description\n        id\n      }\n      ... on Indicator {\n        name\n        description\n        id\n      }\n      ... on Infrastructure {\n        name\n        description\n        id\n      }\n      ... on IntrusionSet {\n        name\n        description\n        id\n      }\n      ... on Position {\n        name\n        description\n        id\n      }\n      ... on City {\n        name\n        description\n        id\n      }\n      ... on Country {\n        name\n        description\n        id\n      }\n      ... on Region {\n        name\n        description\n        id\n      }\n      ... on Malware {\n        name\n        description\n        id\n      }\n      ... on ThreatActor {\n        name\n        description\n        id\n      }\n      ... on Tool {\n        name\n        description\n        id\n      }\n      ... on Vulnerability {\n        name\n        description\n        id\n      }\n      ... on Incident {\n        name\n        description\n        id\n      }\n      ... on Artifact {\n        id\n      }\n      ... on AutonomousSystem {\n        id\n      }\n      ... on CryptocurrencyWallet {\n        id\n      }\n      ... on CryptographicKey {\n        id\n      }\n      ... on Directory {\n        id\n      }\n      ... on DomainName {\n        id\n      }\n      ... on EmailAddr {\n        id\n      }\n      ... on EmailMessage {\n        id\n      }\n      ... on EmailMimePartType {\n        id\n      }\n      ... on ExternalReference {\n        id\n      }\n      ... on Hostname {\n        id\n      }\n      ... on IPv4Addr {\n        id\n      }\n      ... on IPv6Addr {\n        id\n      }\n      ... on KillChainPhase {\n        id\n      }\n      ... on Label {\n        id\n      }\n      ... on MacAddr {\n        id\n      }\n      ... on MarkingDefinition {\n        id\n      }\n      ... on Mutex {\n        id\n      }\n      ... on NetworkTraffic {\n        id\n      }\n      ... on Note {\n        id\n      }\n      ... on ObservedData {\n        id\n      }\n      ... on Opinion {\n        id\n      }\n      ... on Process {\n        id\n      }\n      ... on Report {\n        id\n      }\n      ... on Software {\n        id\n      }\n      ... on StixCoreRelationship {\n        id\n      }\n      ... on StixCyberObservableRelationship {\n        id\n      }\n      ... on StixFile {\n        id\n      }\n      ... on StixMetaRelationship {\n        id\n      }\n      ... on StixSightingRelationship {\n        id\n      }\n      ... on Text {\n        id\n      }\n      ... on Url {\n        id\n      }\n      ... on UserAccount {\n        id\n      }\n      ... on UserAgent {\n        id\n      }\n      ... on WindowsRegistryKey {\n        id\n      }\n      ... on WindowsRegistryValueType {\n        id\n      }\n      ... on X509Certificate {\n        id\n      }\n    }\n  }\n}\n",
      variables: {
        relationship_type: "stix-core-relationship",
        toTypes: [
          "Threat-Actor",
          "Intrusion-Set",
          "Campaign",
          "Malware",
          "Tool",
          "Vulnerability",
        ],
        field: "internal_id",
        operation: "count",
        startDate: "2022-05-13T00:00:00+01:00",
        endDate: null,
        dateAttribute: "created_at",
        limit: 10,
      },
    };
    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  radarChartData: async (req, res, next) => {
    const body = {
      id: "DashboardStixCyberObservablesDistributionQuery",
      query:
        "query DashboardStixCyberObservablesDistributionQuery(\n  $field: String!\n  $operation: String!\n) {\n  stixCyberObservablesDistribution(field: $field, operation: $operation) {\n    label\n    value\n  }\n}\n",
      variables: {
        field: "entity_type",
        operation: "count",
      },
    };

    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  lineChartData: async (req, res, next) => {
    const body = {
      id: "DashboardStixDomainObjectsTimeSeriesQuery",
      query:
        "query DashboardStixDomainObjectsTimeSeriesQuery(\n  $field: String!\n  $operation: StatsOperation!\n  $startDate: DateTime!\n  $endDate: DateTime\n  $interval: String!\n) {\n  stixDomainObjectsTimeSeries(field: $field, operation: $operation, startDate: $startDate, endDate: $endDate, interval: $interval) {\n    date\n    value\n  }\n}\n",
      variables: {
        field: "created_at",
        operation: "count",
        startDate: "2021-08-13T00:00:00+01:00",
        endDate: null,
        interval: "month",
      },
    };
    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  threadReport: async (req, res, next) => {
    const body = {
      id: "DashboardLastStixDomainObjectsQuery",
      query:
        "query DashboardLastStixDomainObjectsQuery(\n  $first: Int\n  $orderBy: StixDomainObjectsOrdering\n  $orderMode: OrderingMode\n  $types: [String]\n) {\n  stixDomainObjects(first: $first, orderBy: $orderBy, orderMode: $orderMode, types: $types) {\n    edges {\n      node {\n        __typename\n        id\n        entity_type\n        created_at\n        ... on Report {\n          name\n        }\n        ... on Note {\n          attribute_abstract\n          content\n        }\n        ... on Opinion {\n          opinion\n          explanation\n        }\n        createdBy {\n          __typename\n          __isIdentity: __typename\n          id\n          name\n          entity_type\n        }\n        objectMarking {\n          edges {\n            node {\n              id\n              definition\n            }\n          }\n        }\n      }\n    }\n  }\n}\n",
      variables: {
        first: 8,
        orderBy: "created_at",
        orderMode: "desc",
        types: ["Report", "Note", "Opinion"],
      },
    };
    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getTotalEntities: async (req, res, next) => {
    const body = {
      id: "DashboardStixDomainObjectsNumberQuery",
      query:
        "query DashboardStixDomainObjectsNumberQuery(\n  $types: [String]\n  $endDate: DateTime\n) {\n  stixDomainObjectsNumber(types: $types, endDate: $endDate) {\n    total\n    count\n  }\n}\n",
      variables: {
        types: null,
        endDate: "2022-07-29T13:53:22+01:00",
      },
    };
    return axios
      .post(url, body, header)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },


};
module.exports = reclamationCtrl;
