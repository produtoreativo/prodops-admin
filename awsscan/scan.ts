import { ConfigService, ResourceGroupsTaggingAPI, ResourceExplorer2 } from 'aws-sdk';
// import * as dotenv from "dotenv";
// console.log('path: ', __dirname+'/../.env')
// dotenv.config({ path: __dirname+'/../.env' });

console.log(process.env.AWS_ACCESS_KEY_ID)

const region = 'us-east-1';
// const params = {
//   limit: 10,
//   // nextToken: 'STRING_VALUE',
//   resourceTypes: [
//     'AWS::Lambda::Function',
//     'AWS::CloudFront::Distribution',
//     'AWS::EC2::VPC',
//   ]
// };
// const configservice = new ConfigService({
//   region: 'us-east-1'
// });
// configservice.getDiscoveredResourceCounts(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// const resourcegroupstaggingapi = new ResourceGroupsTaggingAPI({
//   region,
// });
// resourcegroupstaggingapi.describeReportCreation(params, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// const params = {
//   QueryString: 'AWS::Lambda::Function'
// };
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// const resourceexplorer2 = new ResourceExplorer2({ region, accessKeyId, secretAccessKey });
// resourceexplorer2.search(params, function (err, data) {
//   // if (err) console.log(err, err.stack); // an error occurred
//   if (err) console.log(err, err.message); // an error occurred
//   else     console.log(data);           // successful response
// });