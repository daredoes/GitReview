import React from "react"
import PropTypes from "prop-types"

class GitUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        let { user } = this.props;
        let { profile } = user;
        let { login } = profile;
        return <div>{login}</div>
    }
}

GitUser.propTypes = {
    user: PropTypes.shape({
        addRepository: PropTypes.func,
        getPullRequests: PropTypes.func,
        getRepositories: PropTypes.func,
        gh: PropTypes.shape({}),
        profile: PropTypes.shape({
            avatar_url: PropTypes.string,
            bio: PropTypes.string,
            blog: PropTypes.string,
            collaborators: PropTypes.number,
            company: PropTypes.string,
            created_at: PropTypes.string,
            disk_usage: PropTypes.number,
            email: PropTypes.string,
            events_url: PropTypes.string,
            followers: PropTypes.number,
            followers_url: PropTypes.string,
            following: PropTypes.number,
            following_url: PropTypes.string,
            gists_url: PropTypes.string,
            gravatar_id: PropTypes.string,
            hireable: PropTypes.bool,
            html_url: PropTypes.string,
            id: PropTypes.number,
            location: PropTypes.string,
            login: PropTypes.string,
            name: PropTypes.string,
            node_id: PropTypes.string,
            organizations_url: PropTypes.string,
            owned_private_repos: PropTypes.number,
            plan: PropTypes.shape({
                name: PropTypes.string,
                space: PropTypes.number,
                collaborators: PropTypes.number,
                private_repos: PropTypes.number
            }),
            private_gists: PropTypes.number,
            public_gists: PropTypes.number,
            public_repos: PropTypes.number,
            received_events_url: PropTypes.string,
            repos_url: PropTypes.string,
            site_admin: PropTypes.bool,
            starred_url: PropTypes.string,
            subscriptions_url: PropTypes.string,
            total_private_repos: PropTypes.number,
            two_factor_authentication: PropTypes.bool,
            type: PropTypes.string,
            updated_at: PropTypes.string,
            url: PropTypes.string
        }),
        pull_requests: PropTypes.shape({

        }),
        refreshPullRequests: PropTypes.func,
        refreshPullRequestsForRepository: PropTypes.func,
        repositories: PropTypes.shape({
            watching: PropTypes.bool,
            repository: PropTypes.shape({

            })
        }),
        user: PropTypes.shape({})
    }).isRequired
    
  }
  
  export default GitUser
  