var AWS = require('aws-sdk');

module.exports.sendOTP = (req, res) => {
	const params = {
		PhoneNumber: `+${req.query.number.trim()}`,
		LanguageCode: req.query.lang,
	};
	console.log(params);
	const publishOTPPromise = new AWS.SNS({ apiVersion: '2010-03-31' })
		.createSMSSandboxPhoneNumber(params)
		.promise();
	publishOTPPromise
		.then(function (data) {
			console.log(data);
			res.end(JSON.stringify({ RequestId: data.ResponseMetadata.RequestId }));
		})
		.catch(function (err) {
			res.end(JSON.stringify({ Error: err }));
		});
};

module.exports.verifyOTP = (req, res) => {
	const params = {
		OneTimePassword: req.query.otp,
		PhoneNumber: `+${req.query.number.trim()}`,
	};
	const publishOTPVerification = new AWS.SNS({ apiVersion: '2010-03-31' })
		.verifySMSSandboxPhoneNumber(params)
		.promise();
	publishOTPVerification
		.then(function (data) {
			res.end(JSON.stringify({ RequestId: data.ResponseMetadata.RequestId }));
		})
		.catch(function (err) {
			res.end(JSON.stringify({ Error: err }));
		});
};
