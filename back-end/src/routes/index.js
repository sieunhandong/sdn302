const UserRouter = require('./UserRouter')
const Recruitment = require('./RecruitmentRouter')
const Project = require('./ProjectRouter')


const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/recruitment', Recruitment)
    app.use('/api/project', Project)

}

module.exports = routes