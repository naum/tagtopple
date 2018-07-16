const CE = React.createElement;
const MAX_POSTS = 1000;
const REPOCOL1 = { className: 'celnum wid16' };
const REPOCOL2 = { className: 'celtex wid58' };
const REPOCOL3 = { className: 'celnum wid25' };
const TUMBLR_API_URL = 'http://azspot.net/api/read/json/?num=50&start=';
//const TUMBLR_API_URL = 'http://gnacancellaro.tumblr.com/api/read/json/?num=50&start=';
const TUMBLR_TAG_PRE = 'https://tumblr.com/tagged/';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            error: null,
            statmess: 'Welcome!',
            tumbdata: {},
            tagboard: {},
            tumbsite: null,
            startnum: 0
        }
        this.getTumblrData = this.getTumblrData.bind(this);
        this.handleSiteChange = this.handleSiteChange.bind(this);
        this.handleSiteFetch = this.handleSiteFetch.bind(this);
    }
    componentDidMount() {
        //this.getTumblrData()
        console.log('Inside componentDidMount...');
    }
    getTumblrData() {
        const apiurl = TUMBLR_API_URL + this.state.startnum;
        fetch(apiurl)
            .then(rsp => {
                if (rsp.ok) {
                    this.setState({ statmess: 'Response OK'});
                    return rsp.text()
                } else {
                    this.setState({ statmess: '404!' });
                    console.log('we went 404!');
                    return;
                }
            })
            .then(data => {
                if (data) {
                    const tdhash = JSON.parse(data.slice(22, -2));
                    console.log(tdhash);
                    console.log('TITLE='+tdhash.tumblelog.title);
                    this.setState({
                        tumbdata: tdhash,
                        tagboard: tallyTumblrTags(tdhash, this.state.tagboard)
                    });
                    console.log('TOTAL POSTS='+tdhash['posts-total']);
                    const nextstart = this.state.startnum + 50;
                    if (nextstart < tdhash['posts-total'] && nextstart < MAX_POSTS) {
                        this.setState( { startnum: nextstart });
                        setTimeout(this.getTumblrData, 5000);
                    }
                }
            })
            .catch(error => {
                this.setState({
                    statmess: error
                })
            })
    }
    handleSiteChange(e) {
        console.log('Inside handleSiteChange...');
    }
    handleSiteFetch(e) {
        console.log('Inside handleSiteFetch...');
    }
    render() {
        let { statmess, tagboard } = this.state;
        return CE(
            'div',
            { className: 'wrapper' },
            CE(Header),
            CE(
                ControlPanel,
                { 
                    handleSiteChange: this.handleSiteChange,
                    handleSiteFetch: this.handleSiteFetch,
                }
            ),
            CE(StatusMessage, { m: statmess }),
            CE(TumblrTagBoard, { tb: tagboard }),
            CE(Footer)
        )
    }
}

function ControlPanel(props) {
    let { handleSiteChange, handleSiteFetch } = props;
    return CE(
        'div',
        { className: 'controlpanel'},
        CE(
            'input',
            { type: 'text', onChange: handleSiteChange }
        ),
        CE(
            'button',
            { onClick: handleSiteFetch },
            'Go'
        )
    )
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

function StatusMessage({ m }) {
    return CE (
        'div',
        { className: 'statusmessage' },
        m 
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
    let taglist = Object.keys(tb);
    taglist.sort((a, b) =>
        tb[b] - tb[a]
    );
    const tagrepolines = taglist.map((tag, i) =>
        React.createElement(
            TumblrTagReportLine,
            { rank: i + 1, tag: tag, total: tb[tag], key: tag }
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
        React.createElement('th', REPOCOL1, '#'),
        React.createElement('th', REPOCOL2, 'tag'),
        React.createElement('th', REPOCOL3, 'total')
    )
}

function TumblrTagReportLine({ rank, tag, total }) {
    return CE(
        'tr',
        { className: 'repoline' },
        CE('td', REPOCOL1, rank),
        CE('td', REPOCOL2, a(TUMBLR_TAG_PRE + tag, tag)),
        CE('td', REPOCOL3, total)
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