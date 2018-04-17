'use strict';

let router ;
let app ;
let wd = new WikiData() ;

let config = {} ;
let prop_map = {} ;

$(document).ready ( function () {
    vue_components.toolname = 'reasonator_v2' ;
    vue_components.components_base_url = 'https://tools.wmflabs.org/magnustools/resources/vue/' ; // For testing; turn off to use tools-static
    Promise.all ( [
            vue_components.loadComponents ( ['widar','wd-date','wd-link','tool-translate','tool-navbar','commons-thumbnail',
                'main-page.html',
                'classifier.html',
                'property-list.html',
                'coordinates.html',
                'claim.html',
                'snak.html',
                'reasonator-link.html',
                'sidebar.html'
                ] ) ,
            new Promise(function(resolve, reject) {
                $.get ( './config.json' , function (d) {
                    config = d ;
                    resolve() ;
                } , 'json' ) ;
            } )
    ] ) .then ( () => {
        prop_map = config.prop_map ;
        wd_link_base = config.wikibase_page_url ;
        wd_link_wd = wd ;
        wd.api = config.wikibase_api + '?callback=?' ;

        const routes = [
          { path: '/', component: MainPage , props:true },
              { path: '/:q', component: MainPage , props:true },
        ] ;
        router = new VueRouter({routes}) ;
        app = new Vue ( { router } ) .$mount('#app') ;
    } ) ;
} ) ;
