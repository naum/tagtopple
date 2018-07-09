const TUMBLR_API_URL = 'http://azspot.net/api/read/json';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tumbdata: {} }
    }
    componentDidMount() {
        this.getTumblrData()
    }
    getTumblrData() {
        return fetch(TUMBLR_API_URL)
            .then(rsp => rsp.text())
            .then(data => {
                const tdhash = JSON.parse(data.slice(22, -2));
                console.log(tdhash);
                console.log(tdhash.tumblelog.title);
                this.setState({
                    tumbdata: tdhash
                })
            })
    }
    render() {
        let title = "Not set yet.";
        let posts = [];
        if (this.state.tumbdata && this.state.tumbdata.tumblelog) {
            title = this.state.tumbdata.tumblelog.title;
            posts = this.state.tumbdata.posts;
        }
        return React.createElement(
            'div',
            { className: 'wrapper' },
            React.createElement(Header),
            React.createElement(
                TumblrConsole, 
                { 
                    title: title, 
                    posts: posts, 
                }
            ),
            React.createElement(Footer)
        )
    }
}

function Footer(props) {
    return React.createElement(
        'div',
        { className: 'footing' },
        'A GNT creation \u00A92018'
    )
}

function Header(props) {
    return React.createElement(
        'h1',
        { className: 'heading' },
        'Welcome to Tag Topple!'
    )
}

function TumblrConsole({ title, posts }) {
    return React.createElement(
        'div',
        { className: 'tumblrconsole' },
        React.createElement('h2', {}, title),
        React.createElement(TumblrPostList, { posts: posts })
    )
}

function TumblrPostList({ posts }) {
    return posts.map(p => 
        React.createElement(TumblrPostListItem, { key: p.id, post: p })
    )    
}

function TumblrPostListItem({ post }) {
    return React.createElement(
        'li',
        { className: 'postdumpline' },
        post['url-with-slug'] 
    )
}

var container = document.querySelector('#appspace');
ReactDOM.render(
    React.createElement(Wrapper), 
    container
);