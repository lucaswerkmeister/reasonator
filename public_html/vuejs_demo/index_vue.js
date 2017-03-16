
// Global object for central cache etc.
var wikidata = {
	api : 'https://www.wikidata.org/w/api.php' ,
	item_cache : {} ,
	language : 'en' ,
	fallback_languages : [ 'de' , 'es' , 'fr' , 'it' , 'nl' , 'zh' ]
} ;

// Item class
function WikidataItem ( _json ) {
	this.json = _json ;
	
	this.getCurrentLanguage = function () {
		return wikidata.language ;
	}

	this.getID = function () {
		return this.json.id ;
	}
	
	this.getPage = function () {
		var id = this.getID() ;
		if ( id.match ( /^P/ ) ) return "Property:" + id ;
		return id ;
	}

	this.getLabel = function ( language ) {
		return this.getLabelOrDescription ( language , 'labels' ) ;
	}
	
	this.getDescription = function ( language ) {
		return this.getLabelOrDescription ( language , 'descriptions' ) ;
	}
	
	this.getAliases = function ( language ) {
		var me = this ;
		var ret = [] ;
		if ( typeof language == 'undefined' ) language = me.getCurrentLanguage() ;
		if ( typeof me.json == 'undefined' ) return ret ;
		if ( typeof me.json.aliases == 'undefined' ) return ret ;
		if ( typeof me.json.aliases[language] == 'undefined' ) return ret ;
		$.each ( me.json.aliases[language] , function ( k , v ) {
			ret.push ( v.value ) ;
		} ) ;
		return ret ;
	}
	
	this.getStringValues = function ( prop ) {
		var me = this ;
		var ret = [] ;
		if ( typeof me.json == 'undefined' ) return ret ;
		if ( typeof me.json.claims == 'undefined' ) return ret ;
		if ( typeof me.json.claims[prop] == 'undefined' ) return ret ;
		$.each ( me.json.claims[prop] , function ( k , v ) {
			if ( typeof v.mainsnak == 'undefined' ) return ;
			if ( typeof v.mainsnak.datavalue == 'undefined' ) return ;
			if ( v.mainsnak.datavalue.type != 'string' ) return ;
			ret.push ( v.mainsnak.datavalue.value ) ;
		} ) ;
		return ret ;
	}
	
	this.getLabelOrDescription = function ( language , mode , stop_recurse ) {
		var me = this ;
		var ret = mode == 'labels' ? me.getID() : '' ; // Fallback
		if ( typeof language == 'undefined' ) language = me.getCurrentLanguage() ;

		if ( typeof me.json == 'undefined' ) return ret ;
		if ( typeof me.json[mode] == 'undefined' ) return ret ;

		if ( typeof me.json[mode][language] != 'undefined' && typeof me.json[mode][language].value != 'undefined' ) {
			ret = me.json[mode][language].value ;
		} else if ( !stop_recurse ) {
			$.each ( wikidata.fallback_languages , function ( dummy , lang ) {
				if ( typeof me.json[mode][lang] == 'undefined' || typeof me.json[mode][lang].value == 'undefined' ) return ;
				ret = me.json[mode][lang].value ;
				language = lang ;
				return false ;
			} ) ;
		}
		return [ ret , language ] ;
	}
}


var wikidataAPImixin = {
	methods : {
		hasItem : function ( item ) {
			return ( typeof wikidata.item_cache[item] != 'undefined' ) ;
		} ,
		getItem : function ( item ) {
			return wikidata.item_cache[item] ;
		} ,
		loadItems : function ( items , callback ) {
			var me = this ;
			var cnt = 0 ;
			
			function fin () {
				if ( --cnt > 0 ) return ;
				callback() ;
			}
			
			// Init
			var groups = {} ; // Separating into Q, P etc. might not be necessary, but it feels future-proof...
			$.each ( items , function ( dummy , item ) {
				if ( typeof item == 'undefined' ) return ;
				var i = $.trim ( item.toUpperCase() ) ;
				if ( typeof wikidata.item_cache[i] != 'undefined' ) return ; // We already have that in the cache
				var type = i.substr(0,1) ;
				if ( typeof groups[type] == 'undefined' ) groups[type] = {} ;
				groups[type][i] = i ;
				cnt++ ;
			} ) ;
			if ( cnt == 0 ) return fin () ; // All in cache already, my work here is done

			cnt = 0 ;
			$.each ( groups , function ( group , items ) {
				var tmp = [ [] ] ;
				$.each ( items , function ( dummy , i ) {
					if ( tmp[tmp.length-1].length >= 50 ) tmp.push ( [] ) ;
					tmp[tmp.length-1].push ( i ) ;
				} ) ;
				$.each ( tmp , function ( dummy , subgroup ) {
					cnt++ ;
					$.getJSON ( wikidata.api+'?callback=?' , {
						action:'wbgetentities',
						ids:subgroup.join('|'),
						format:'json'
					} , function ( d ) {
						$.each ( d.entities , function ( k , v ) {
							wikidata.item_cache[k] = new WikidataItem ( v ) ;
						} ) ;
					} )
					.fail ( function () {} ) // TODO
					.always ( function () { fin() } ) ;
				} ) ;
			} ) ;
		}
	}
} ;



Vue.component ( 'snakview-value' , {
	template : '#snakview-value-template' ,
//	mixins: [wikidataAPImixin] ,
	props : [ 'mainsnak' ]
} ) ;


Vue.component ( 'qualifiers' , {
	template : '#qualifiers-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'statement' ]
} ) ;

Vue.component ( 'references' , {
	template : '#references-template' ,
	mixins: [wikidataAPImixin] ,
	data : function () { return { collapsed:true } } ,
	props : [ 'statement' ] ,
	methods : {
		getReferenceCount : function () {
			if ( typeof this.statement.references == 'undefined' ) return 0 ;
			return this.statement.references.length ;
		} ,
		addReference : function () {
			alert ( 'Not yet implemented' ) ;
		}
	}
} ) ;


Vue.component ( 'reference-group' , {
	template : '#reference-group-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'group' ]
} ) ;


Vue.component ( 'wikidata-link' , {
	template : '#wikidata-link-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'item' ]
} ) ;



Vue.component ( 'item-label' , {
	template : '#item-label-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'item' , 'linked' , 'small' ]
} ) ;

Vue.component ( 'item-description' , {
	template : '#item-description-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'item' ]
} ) ;

Vue.component ( 'item-aliases' , {
	template : '#item-aliases-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'item'  ]
} ) ;


Vue.component ( 'string-value' , {
	template : '#string-value-template' ,
	props : [ 'mainsnak' ]
} ) ;

Vue.component ( 'external-id-value' , {
	template : '#external-id-value-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'mainsnak' ]
} ) ;

Vue.component ( 'wb-item-value' , {
	template : '#wb-item-value-template' ,
	props : [ 'mainsnak' ]
} ) ;

Vue.component ( 'time-value' , {
	template : '#time-value-template' ,
	props : [ 'mainsnak' ] ,
	methods : {
		render : function () {
			var me = this ;
			var time = me.mainsnak.datavalue.value.time ;
			if ( me.mainsnak.datavalue.value.calendarmodel != 'http://www.wikidata.org/entity/Q1985727' ) return time ;
			var m = time.match ( /^([\+\-]{0,1})(\d+)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/ ) ;
			if ( m === null ) return time ;
			
			if ( m[1] == '+' ) m[1] = '' ;
			
			if ( me.mainsnak.datavalue.value.precision ==  9 ) return m[1]+m[2] ;
			if ( me.mainsnak.datavalue.value.precision == 10 ) return m[1]+m[2]+'-'+m[3] ;
			if ( me.mainsnak.datavalue.value.precision == 11 ) return m[1]+m[2]+'-'+m[3]+'-'+m[4] ;
			
			return time ;
		}
	}
} ) ;

Vue.component ( 'coordinate-value' , {
	template : '#coordinate-value-template' ,
	props : [ 'mainsnak' ] ,
	methods : {
		render : function () {
			var me = this ;
			if ( me.mainsnak.datavalue.value.globe != 'http://www.wikidata.org/entity/Q2' ) return '???' ;
			
			var ns = me.mainsnak.datavalue.value.latitude > 0 ? 'N' : 'S' ;
			var ew = me.mainsnak.datavalue.value.longitude > 0 ? 'E' : 'W' ;
			
			var ret = 'https://tools.wmflabs.org/geohack/geohack.php?language=en&params='+
				me.mainsnak.datavalue.value.latitude + '_' + ns + '_' +
				me.mainsnak.datavalue.value.longitude + '_' + ew + '_globe:earth' ;
			
			return ret ;
		}
	}
} ) ;

Vue.component ( 'quantity-value' , {
	template : '#quantity-value-template' ,
	props : [ 'mainsnak' ] ,
	methods : {
		addCommas : function (nStr) {
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		} ,
		render : function () {
			var me = this ;
			var ret = me.addCommas ( me.mainsnak.datavalue.value.amount * 1 ) ;
			return ret ;
		}
	}
} ) ;



Vue.component ( 'statement' , {
	template : '#statement-template' ,
	props : [ 'statement' , 'item' ] ,
	methods : {
		editStatement : function () {
			alert ( 'Not yet implemented' ) ;
		}
	}
} ) ;


Vue.component ( 'statements' , {
	template : '#statements-template' ,
	props : [ 'statements' , 'item' ] ,
	methods : {
		getProperty : function () {
			return this.statements[0].mainsnak.property ;
		} ,
		addNewStatement : function () {
			alert ( 'Not yet implemented' ) ;
		}
	}
} ) ;


var MainPage = Vue.extend ( {
	template : '#main-page-template' ,
} ) ;

var ItemPage = Vue.extend ( {
	template : '#item-page-template' ,
	mixins: [wikidataAPImixin] ,
	props : [ 'item' ] ,
	data : function () { return { loaded:false , i:{} , statements:[] } } ,
	created : function () { this.loadItem() } ,
	methods : {
		orderStatements : function () {
			var me = this ;
			var statements = [ {label:'Statements',list:[]} , {label:'Identifiers',list:[]} ] ;
			$.each ( (me.i.json.claims||{}) , function ( prop , claims ) {
				if ( claims[0].mainsnak.datatype == 'external-id' ) statements[1].list.push ( claims ) ;
				else statements[0].list.push ( claims ) ;
			} ) ;
			me.statements = statements ;
		} ,
		preloadRelatedItems : function ( callback ) {
			var me = this ;
			var to_load = [] ;
			$.each ( (me.i.json.claims||{}) , function ( prop , statements ) {
				to_load.push ( prop ) ;
				$.each ( statements , function ( dummy , statement ) {
					if ( statement.mainsnak.datatype == 'wikibase-item' ) to_load.push ( statement.mainsnak.datavalue.value.id ) ;
					if ( typeof statement.qualifiers != 'undefined' ) {
						$.each ( statement.qualifiers , function ( k1 , v1 ) {
							$.each ( v1 , function ( k2 , v2 ) {
								to_load.push ( v2.property ) ;
								if ( v2.datatype == 'wikibase-item' ) to_load.push ( v2.datavalue.value.id ) ;
							} ) ;
						} ) ;
					}
					if ( typeof statement.references != 'undefined' ) {
						$.each ( statement.references , function ( k1 , v1 ) {
							$.each ( v1.snaks , function ( k2 , v2 ) {
								$.each ( v2 , function ( k3 , v3 ) {
									to_load.push ( v3.property ) ;
									if ( v3.datatype == 'wikibase-item' ) to_load.push ( v3.datavalue.value.id ) ;
								} ) ;
							} ) ;
						} ) ;
					}
				} ) ;
			} ) ;
			me.loadItems ( to_load , callback ) ;
		} ,
		loadItem : function () {
			var me = this ;
			me.loaded = false ;
			me.loadItems ( [ me.item ] , function () {
				me.i = me.getItem ( me.item ) ;
				me.preloadRelatedItems ( function () {
					me.orderStatements() ;
					me.loaded = true ;
				} ) ;
			} ) ;
		}
	} ,
	watch: {
		'$route' (to, from) {
			this.loadItem() ;
		}
	}
} ) ;

var router ;
var app ;


const routes = [
  { path: '/', component: MainPage },
  { path: '/item/:item', component: ItemPage , props:true },
] ;

$(document).ready ( function () {
	router = new VueRouter({routes}) ;
	app = new Vue ( { router } ) .$mount('#app') ;
} ) ;

