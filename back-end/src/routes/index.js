const UserRouter = require("./UserRouter");
const Recruitment = require("./RecruitmentRouter");
const Project = require("./ProjectRouter");
const Intern = require("./InternRouter");
const Schedule = require("./ScheduleRouter");
const Mentor = require('./MentorRouter')
const Candidate = require('./CandidateRouter')
const Report = require('./ReportRouter')



const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/recruitment", Recruitment);
  app.use("/api/project", Project);
  app.use("/api/intern", Intern);
  app.use("/api/schedule", Schedule);
  app.use('/api/mentor', Mentor);
  app.use('/api/candidate', Candidate);
  app.use('/api/report', Report)

}

module.exports = routes;
