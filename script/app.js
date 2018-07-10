const REPOCOL1 = { className: 'celtex wid75' };
const REPOCOL2 = { className: 'celnum wid25' }
const TUMBLR_API_URL = 'http://azspot.net/api/read/json/?num=50&start=';
const TUMBLR_TAG_PRE = 'https://tumblr.com/tagged/';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            tumbdata: {},
            tagboard: {},
            startnum: 400
        }
    }
    componentDidMount() {
        this.getTumblrData()
    }
    getTumblrData() {
        const apiurl = TUMBLR_API_URL + this.state.startnum;
        return fetch(apiurl)
            .then(rsp => rsp.text())
            .then(data => {
                const tdhash = JSON.parse(data.slice(22, -2));
                console.log(tdhash);
                console.log(tdhash.tumblelog.title);
                this.setState({
                    tumbdata: tdhash,
                    tagboard: tallyTumblrTags(tdhash, this.state.tagboard)
                })
            })
    }
    render() {
        return React.createElement(
            'div',
            { className: 'wrapper' },
            React.createElement(Header),
            React.createElement(TumblrTagBoard, { tb: this.state.tagboard }),
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
        'Tumblr Tag Topple'
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

function TumblrTagBoard({ tb }) {
    taglist = Object.keys(tb);
    taglist.sort((a, b) =>
        tb[b] - tb[a]
    );
    const tagrepolines = taglist.map(tag =>
        React.createElement(
            TumblrTagReportLine,
            { tag: tag, total: tb[tag], key: tag }
        )
    )
    return React.createElement(
        'table',
        { className: 'tumblrtagboard' },
        React.createElement(
            'tbody',
            {}, 
            React.createElement(TumblrTagReportHeading, {}),
            tagrepolines
        )
    )
}

function TumblrTagReportHeading(props) {
    return React.createElement(
        'tr',
        { className: 'repoheading' },
        React.createElement('th', REPOCOL1, 'tag' ),
        React.createElement('th', REPOCOL2, 'total' )
    )
}

function TumblrTagReportLine({ tag, total }) {

    return React.createElement(
        'tr',
        { className: 'repoline' },
        React.createElement(
            'td',
            REPOCOL1,
            a(TUMBLR_TAG_PRE + tag, tag)
        ),
        React.createElement(
            'td',
            REPOCOL2,
            total
        )
    )
}

function a(u, d) {
    return React.createElement(
        'a',
        { href: u },
        d
    )
}

function tallyTumblrTags(tdhash, prevtb) {
    let tb = Object.assign({}, prevtb)
    tdhash.posts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                if (tb[tag]) {
                    tb[tag] += 1;
                } else {
                    tb[tag] = 1;
                }
            })
        }
    })
    return tb;
}

var container = document.querySelector('#appspace');
ReactDOM.render(
    React.createElement(Wrapper), 
    container
);