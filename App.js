import React from 'react';
import { FlatList, Text, Linking} from 'react-native';
let cheerio = require('react-native-cheerio');

export default class App extends React.Component{
  baseUrl = 'http://103.91.144.230/ftpdata/Movies/'
  constructor(props){
    super(props);
    this.state = {
      links: [],
      url: this.baseUrl
    };
  }
  componentDidMount(){
    let links = this.getHrefs(this.baseUrl).then((links)=>{
      this.setState({
        links: links
      });
    });
  }
  getHrefs(url){
    return fetch(url).then((result)=>{
      return result.text().then((html)=>{
        return new Promise((resolve, reject)=> {
          const $ = cheerio.load(html);
          let hrefs = [];
          $('a').each((i, elem)=>{
            hrefs.push(this.state.url+elem.attribs.href);
          });
          resolve(hrefs);
        });
      });
    });
  }
  render() {
    return (
      <FlatList
        data = {this.state.links}
        keyExtractor={(item, index)=>{
          return index.toString();
        }}
        renderItem={({item})=>{
          return (
            <Text 
            onPress={()=>{
              if(item[item.length-1] == '/'){
                this.setState({
                  url: item
                },
                ()=>{
                this.getHrefs(item).then((links)=>{
                  this.setState({
                    links: links
                  });
                });
              })
              } else {
                Linking.openURL(item);
              }
            }}
            numberOfLines={1} style={{width: '100%', height: 50, textAlign: 'center'}}>
              {item}
            </Text>
          )
        }}
        />
    )
  }
}