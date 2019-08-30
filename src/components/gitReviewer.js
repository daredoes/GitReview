import GitHub from "github-api"

class GitUser {
    user = null;
    repositories = {};
    pull_requests = {};
    profile = {};
    gh = null;

    constructor(gh, user, profile={}){
        this.gh = gh;
        this.user = user;
        this.profile = profile;
        this.getRepositories();
    }

    getRepositories = () => {
        if (this.user) {
            this.user.listRepos((e, r, res) => {
                if (!e) {
                    r.forEach((repo) => {
                        this.addRepository(repo);
                    })
                }
            })
        }
    }

    refreshPullRequests = () => {
        Object.keys(this.repositories).forEach((key) => {
            this.refreshPullRequestsForRepository(key);
        })
    }

    refreshPullRequestsForRepository = (key) => {
        if (this.repositories[key].watching) {
            this.getPullRequests(key);
        }
    } 


    getPullRequests = (key) => {

        if (this.repositories.hasOwnProperty(key)) {
            this.repositories[key].repository.listPullRequests({}, (e, r, res) => {
                if (!e) {
                    r.forEach((pullRequest) => {
                        pullRequest.requested_reviewers.forEach((reviewer) => {
                            if (reviewer.login == this.profile.login) {
                                this.pull_requests[pullRequest.id] = pullRequest;
                            }
                        })
                    })
                }
            })
        }
    }

    addRepository = (repo) => {
        const currentCopy = repo.id && this.repositories.hasOwnProperty(repo.id) ? this.repositories[repo.id] : {};
        this.repositories[repo.id] = Object.assign({watching: false, repository: this.gh.getRepo(repo.owner.login, repo.name)}, currentCopy, repo);
    }
}

class GitReviewer {
    users = {};
    token = null;
    gh = null;

    constructor(token = null, onLogin = () => {}) {
        this.setToken(token, onLogin);
    }

    setToken = (token = null, onLogin = () => {}) => {
        this.gh = new GitHub(token);
        this.addUser(null, () => {
            this.token = token;
            onLogin();
        });
    }

    getUsers = () => {
        return this.users;
    }

    addUser = (username = null, successCallback = null) => {
        let user = this.gh.getUser(username);
        user.getProfile((e, r, res) => {
            if (!e) {
                this.users[r.login] = new GitUser(this.gh, user, r);
                successCallback(e, r, res, user);
            }
        })
    }

    removeUser = (username) => {
        if (this.users.hasOwnProperty(username)) {
            delete this.users[username];
            return true;
        }
        return false;
    }
}

export default GitReviewer