var reasonator = {
	i18n : {} ,
	collapse_item_list : 20 ,
	P_all : {
		entity_type : 107 ,
		audio : 51 ,
		instance_of : 31 ,
		voice_recording : 990 ,
		commons_cat : 373 ,
		commons_gallery : 935 ,
		video : 10 ,
		maic : 301 , // Main article in category
		flag_image : 41 ,
		wikivoyage_banner : 948 ,
		coa : 94 ,
		seal : 158 ,
		image : 18
	} ,
	P_websites : {
		official_website : 856
	} ,
	P_person : {
		father : 22 ,
		mother : 25 ,
		child : 40 ,
		brother : 7 ,
		sister : 9 ,
		spouse : 26 ,
		uncle : 29 ,
		aunt : 139 ,
		relative : 1038 ,
		stepfather : 43 ,
		stepmother : 44 ,
		grandparent : 45 ,
		nationality : 27 ,
		sex : 21 ,
		occupation : 106 ,
		signature : 109 ,
	} ,
	P_taxon : {
		taxon_name : 225 ,
		taxon_rank : 105 ,
		taxon_author : 405 ,
		taxon_type : 427 ,
		IUCN : 141 ,
		range_map : 181 ,
		endemic_to : 183 ,
		parent_taxon : 171 ,
		basionym : 566 ,
		domain : 273 ,
		kingdom : 75 ,
		phylum : 76 ,
		class_ : 77 ,
		order : 70 ,
		family : 71 ,
		genus : 74 ,
		species : 89
	} ,
	P_location : {
		dialing_code : 473 ,
		country_code : 474 ,
		postal_code : 281 ,
		iso_3361_1_a2 : 297 ,
		iso_3361_1_a3 : 298 ,
		iso_3361_1_num : 299 ,
		iso_3361_2 : 300 ,
		nuts : 605 ,
		gss_2011 : 836 ,
		fips_10_4 : 901 ,
		ioc : 984 ,
		gnd_id : 227
	} ,
	P_url : {} ,
	E : {
		215627 : 'person'
	} ,
	Q : {
		human : 5 ,
		male : 6581097 ,
		female : 6581072 ,
		person : 215627 ,
		geographical_feature : 618123
	} ,
	extURLs : {} ,
	urlid2prop : {} ,
	taxon_list : [ 171 , 273 , 75 , 76 , 77 , 70 , 71 , 74 , 89 ] ,
	location_props : [30,17,131,376,501] ,
	
	// http://208.80.153.172/api?q=claim[279:56061]
	location_list : [ 515,6256,1763527,
		7688,15284,19576,24279,27002,28575,34876,41156,41386,50201,50202,50218,50231,50464,50513,55292,74063,86622,112865,137413,149621,156772,182547,192287,192498,203323,213918,243669,244339,244836,270496,319796,361733,379817,380230,387917,398141,399445,448801,475050,514860,533309,542797,558330,558941,562061,610237,629870,646728,650605,672490,685320,691899,693039,697379,717478,750277,765865,770948,772123,831889,837766,838185,841753,843752,852231,852446,855451,867371,867606,874821,877127,878116,884030,910919,911736,914262,924986,936955,1025116,1044181,1048835,1051411,1057589,1077333,1087635,1143175,1149621,1151887,1160920,1196054,1229776,1293536,1342205,1344042,1350310,1365122,1434505,1499928,1548518,1548525,1550119,1569620,1631888,1647142,1649296,1670189,1690124,1724017,1753792,1764608,1771656,1779026,1798622,1814009,1850442,2072997,2097994,2115448,2271985,2280192,2311958,2327515,2365748,2487479,2490986,2513989,2513995,2520520,2520541,2533461,2695008,2726038,2824644,2824645,2824654,2836357,2878104,2904292,2916486,3042547,3076562,3098609,3183364,3247681,3253485,3356092,3360771,3395432,3435941,3455524,3491994,3502438,3502496,3507889,3645512,3750285,3917124,3976641,3976655,4057633,4115671,4161597,4286337,4494320,4683538,4683555,4683558,4683562,4976993,5154611,5195043,5284423,5639312,6501447,6594710,6697142,7631029,7631060,7631066,7631075,7631083,7631093,9301005,9305769,10296503,13220202,13220204,13221722,13558886,14757767,14921966,14921981,14925259,15042137,15044083,15044339,15044747,15045746,15046491,15052056,15055297,15055414,15055419,15055423,15055433,15058775,15063032,15063053,15063057,15063111,15063123,15063160,15063167,15063262,15072309,15072596,15092269,15097620,15125829,15126920,15126956,15133451 ] ,
	
	use_js_refresh : false , // FIXME
	force_wdq : true ,
	use_wdq : ( window.location.protocol == 'http:' ) , // use "false" to deactivate
	wdq_url : 'http://wikidata-wdq-mm.instance-proxy.wmflabs.org/api?callback=?' ,
	banner_width : 700 ,
	max_related_media : 50 ,
	showConceptCloudLink : true ,
	showQRLink : true ,
	allowLabelOauthEdit : false ,
	use_hoverbox : true ,
	mark_missing_labels : true ,
	allow_rtl : true ,
	use_autodesc : true ,
	autodesc_items : [] ,
	
	imgcnt : 0 ,
	table_block_counter : 0 ,

	
	
	
	t : function ( k ) {
		var self = this ;
		var ret = self.i18n['en'][k] ; // Fallback
		
		$.each ( self.wd.main_languages||[] , function ( dummy , l ) {
			if ( undefined === self.i18n[l] || self.i18n[l][k] === undefined) return ;
			ret = self.i18n[l][k] ;
			return false ;
		} ) ;
		return ret ;
	} ,

	clear : function () {
		var self = this ;
		var tmp = {} ;
		$.each ( self.wd.items , function ( q , v ) {
			if ( /^P/.test(q) ) tmp[q] = v ;
		} ) ;
		self.P = $.extend(true, {}, self.P_all);
		self.wd.clear() ;
		self.wd.items = tmp ;
		self.main_type = '' ;
		self.autodesc_items = [] ;
		self.personal_relation_list = [] ;
		self.to_load = [] ;
		$.each ( ['father','mother','child','brother','sister','spouse','uncle','aunt','stepfather','stepmother','grandparent','relative'] , function ( k , v ) {
			self.personal_relation_list.push ( self.P_person[v] ) ;
		} ) ;
	} ,

	getUrlVars : function () {
		var vars = {} ;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1) ;
		var hash = window.location.href.slice(window.location.href.indexOf('#') + 1) ;
		if ( hash == window.location.href ) hash = '' ;
		if ( hash.length > 0 ) hashes = hash ;
		else hashes = hashes.replace ( /#$/ , '' ) ;
		hashes = hashes.split('&');
		$.each ( hashes , function ( i , j ) {
			var hash = j.split('=');
			hash[1] += '' ;
			vars[hash[0]] = decodeURI(hash[1]).replace(/_/g,' ');
		} ) ;
		return vars;
	} ,

	init : function ( callback ) {
		var self = this ;
		self.q = undefined ;
		self.wd = new WikiData ;
		self.do_maps = undefined ;
		self.clear() ;
		
		self.params = self.getUrlVars() ;
		
		if ( self.use_js_refresh ) { 		// History change, update page accordingly
			$(window).hashchange( function(){ // http://benalman.com/projects/jquery-hashchange-plugin/
				self.params = self.getUrlVars() ;
				if ( self.params.q !== undefined ) {
					var new_q = 'Q'+self.params.q.replace(/\D/g,'') ;
					if ( new_q != self.q ) {
						self.q = new_q ;
						self.reShow() ;
					}
				}
				return false ;
			} ) ;
		}


		var loadcnt = 3 ;
		if ( self.params.live !== undefined ) self.use_wdq = false ;
		if ( self.params.q !== undefined ) {
			self.q = 'Q'+self.params.q.replace(/\D/g,'') ;
			loadcnt += 2 ;
			self.wd.getItemBatch ( [self.q] , function ( d1 ) {
				self.addToLoadLater ( self.q ) ;
				loadcnt-- ; if ( loadcnt == 0 ) callback() ;
			} ) ;
			self.getRelatedEntities ( self.q , function () {
				loadcnt-- ; if ( loadcnt == 0 ) callback() ;
			} ) ;
		}
		
		$.getJSON ( '//meta.wikimedia.org/w/api.php?callback=?' , { // Get string props
			action:'parse',
			page:'Reasonator/stringprops',
			format:'json',
			prop:'wikitext'
		} , function ( d ) {
			var text = d.parse.wikitext['*'] ;
			$.each ( text.split("\n") , function ( k , v ) {
				if ( v[0] != '|' ) return ; // Require table cell
				if ( v[1] == '}' || v[1] == '-' ) return ; // Table or row end
				var parts = v.substr(1).split('||') ;
				if ( parts.length != 3 ) return ; // ID , prop number, URL pattern
				var id = $.trim(parts[0]) ;
				var prop = $.trim(parts[1]) ;
				var urlp = $.trim(parts[2]) ;
				self.extURLs[id] = urlp ;
				prop *= 1 ;
				self.urlid2prop[id] = prop ;
				self.P_url[prop] = id ;
				self.P_person[id] = prop ;
				self.P_location[id] = prop ;
			} ) ;
			loadcnt-- ; if ( loadcnt == 0 ) callback() ;
		} ) ;
		self.loadInterfaceText ( function () { // Get interface translations
			loadcnt-- ; if ( loadcnt == 0 ) callback() ;
		} ) ;
		$.getJSON ( '//www.wikidata.org/w/api.php?callback=?' , { // Get site info (languages)
			action:'query',
			meta:'siteinfo',
			siprop:'languages',
			format:'json'
		} , function ( d ) {
			self.all_languages = {} ;
			$.each ( d.query.languages , function ( k , v ) { self.all_languages[v.code] = v['*'] } ) ;
			loadcnt-- ; if ( loadcnt == 0 ) callback() ;
		} ) ;
	} ,

	addToLoadLater : function ( the_q ) {
		var self = this ;
		var i = self.wd.items[the_q] ;
		$.each ( i.getPropertyList() , function ( k1 , p ) {
			self.to_load.push ( 'P'+(p+'').replace(/\D/g,'') ) ;
			var qs = i.getClaimItemsForProperty(p,true) ;
			$.each ( qs , function ( k2 , q2 ) {
				self.to_load.push ( q2 ) ;
			} ) ;
			$.each ( self.wd.items[the_q].raw.claims[p] , function ( dummy , c ) {
				if ( c.qualifiers === undefined ) return ;
				$.each ( c.qualifiers , function ( p2 , cv ) {
					self.to_load.push ( p2 ) ;
					$.each ( cv , function ( dummy2 , c ) {
						if ( c.datavalue === undefined ) return ;
						if ( c.datavalue.value === undefined ) return ;
						if ( c.datavalue.value['entity-type'] != 'item' ) return ;
						self.to_load.push ( 'Q'+c.datavalue.value['numeric-id'] ) ;
					} ) ;
				} ) ;
			} ) ;
		} ) ;
	} ,
	
	loadInterfaceText : function ( callback ) {
		var self = this ;
		$.getJSON ( '//meta.wikimedia.org/w/api.php?callback=?' , {
			action:'parse',
			format:'json',
			prop:'wikitext',
			page:'Reasonator/interface'
		} , function ( d ) {
			var lang = 'none' ;
			$.each ( d.parse.wikitext['*'].split(/\n/) , function ( dummy , row ) {
				var m = row.match(/^=+\s*(.+?)\s*=+$/) ;
				if ( m != null ) {
					lang = m[1].toLowerCase() ;
					self.i18n[lang] = {} ;
					return ;
				}
				m = row.match(/^;\s*([^:]+)\s*:\s*(.+)\s*$/) ;
				if ( m != null ) {
					self.i18n[lang][m[1]] = m[2] ;
				}
			} ) ;
			callback() ;
		} ) ;
	} ,
	
	loadQ : function ( q ) {
		var self = this ;
		self.P = $.extend(true, {}, self.P_all);
		self.q = self.wd.convertToStringArray ( q , 'Q' ) [0] ;
		self.mm_load = [] ;
		$('#main_content').show() ;
		$('#main_content_sub').show() ;
		$('#top').html ( '<i>'+self.t('loading')+'</i>' ) ;
		self.detectAndLoadQ ( self.q ) ;
	} ,
	
	detectAndLoadQ : function ( q ) {
		var self = this ;
		if ( q === undefined ) return ; // TODO error "item not found"
		if ( self.isPerson(q) ) self.loadPerson ( q ) ;
		else if ( self.isTaxon(q) ) self.loadTaxon ( q ) ;
		else if ( self.isLocation(q) ) self.loadLocation ( q ) ;
		else self.loadGeneric ( q ) ;
	} ,

	addMissingPropsLinkingToMainItem : function () {
		var self = this ;
		$.each ( self.wd.items , function ( qp , i ) {
			$.each ( ((i.raw||{}).claims||[]) , function ( prop , v0 ) {
				$.each ( i.getClaimItemsForProperty(prop) , function ( dummy , q ) {
					if ( q != self.q ) return ;
					if ( undefined !== self.wd.items[prop] ) return ;
					if ( -1 != $.inArray ( prop , self.to_load ) ) return ;
					self.to_load.push ( prop ) ;
				} ) ;
			} ) ;
		} ) ;
	} ,
	
	addPropTargetsToLoad : function ( items , props ) {
		var self = this ;
		$.each ( items , function ( dummy0 , q ) {
			q = 'Q'+(q+'').replace(/\D/g,'') ;
			if ( undefined === self.wd.items[q] ) return ; // Paranoia
			$.each ( props , function ( dummy1 , p ) {
				p = 'P'+(p+'').replace(/\D/g,'') ;
				var subitems = self.wd.items[q].getClaimItemsForProperty ( p , true ) ;
				$.each ( subitems , function ( dummy2 , sq ) {
					if ( undefined !== self.wd.items[sq] ) return ; // Had that
					if ( -1 != $.inArray ( sq , self.to_load ) ) return ; // Going to do that
					self.to_load.push ( sq ) ;
				} ) ;
			} ) ;
		} ) ;
	} ,
	

	loadBacktrack : function ( o ) {
		var self = this ;
		if ( self.use_wdq ) {
			$.getJSON ( self.wdq_url , {
				q:o.wdq
			} , function ( d ) {
				var items = [] ;
				$.each ( d.items , function ( k , v ) {
					self.to_load.push ( 'Q'+v ) ;
					items.push ( 'Q'+v ) ;
				} ) ;
				self.wd.getItemBatch ( self.to_load , function () {
					self.to_load = [] ;
					self.addPropTargetsToLoad ( items , o.preload ) ;
					self.loadRest ( o.callback ) ;
				} ) ;
			} ) ;
		} else {
			var wd2 = new WikiData() ;
			wd2.loadItems ( self.q , {
				follow : o.follow ,
				preload : o.preload ,
				preload_all : true ,
				finished : function ( p ) {
					$.each ( wd2.items , function ( k0 , v0 ) {
						if ( undefined !== self.wd.items[k0] ) return ;
						v0.wd = self.wd ;
						self.wd.items[k0] = v0 ;
					} ) ;
					self.loadRest ( o.callback ) ;
				}
			} ) ;
		}
	} ,

	keys2array : function ( o ) {
		var ret = [] ;
		$.each ( o , function ( k , v ) { ret.push ( k ) } ) ;
		return ret ;
	} ,
	



//__________________________________________________________________________________________
	
	isPerson : function ( q ) {
		var self = this ;
		if ( self.wd.items[q].hasClaimItemLink ( self.P.entity_type , self.Q.person ) ) return true ;
		if ( self.wd.items[q].hasClaimItemLink ( self.P.instance_of , self.Q.person ) ) return true ;
		if ( self.wd.items[q].hasClaimItemLink ( self.P.instance_of , self.Q.human ) ) return true ;
		return false ;
	} ,

	isTaxon : function ( q ) {
		var self = this ;
		var ret = false ;
		var props = self.wd.items[q].getPropertyList() ;
		$.each ( self.taxon_list , function ( k , v ) {
			if ( -1 == $.inArray ( 'P'+v , props ) ) return ;
			ret = true ;
			return false ;
		} ) ;
		return ret ;
	} ,

	isLocation : function ( q ) {
		var self = this ;
		if ( self.wd.items[q] !== undefined && self.wd.items[q].raw !== undefined && self.wd.items[q].raw.claims !== undefined && self.wd.items[q].raw.claims['P625'] !== undefined ) return true ;
		if ( self.wd.items[q] !== undefined && self.wd.items[q].raw !== undefined && self.wd.items[q].raw.claims !== undefined && self.wd.items[q].raw.claims['P131'] !== undefined ) return true ;
		if ( self.wd.items[q].hasClaimItemLink ( self.P.entity_type , self.Q.geographical_feature ) ) return true ;
		var ret = false ;
		$.each ( self.location_list , function ( k , v ) {
			if ( self.wd.items[q].hasClaimItemLink ( self.P.instance_of , v ) ) {
				ret = true ;
				return false ;
			}

		} ) ;
		
		return ret ;
	} ,

//__________________________________________________________________________________________
// Load page types

	// Used as final stage by all types
	loadRest : function ( callback ) {
		var self = this ;
		self.P = $.extend(true, self.P, self.P_all, self.P_websites);
		self.wd.getItemBatch ( self.to_load , function ( loaded_items ) {
			self.to_load = [] ;
			self.addMissingPropsLinkingToMainItem () ;
			self.wd.getItemBatch ( self.to_load , function ( loaded_items ) {
				callback() ;
			} ) ;
		} ) ;
	} ,

	loadGeneric : function ( q ) {
		var self = this ;
		self.P = $.extend(true, self.P, self.P_all, self.P_websites);
		self.main_type = 'generic' ;
		self.loadRest ( function () { self.showGeneric ( q ) } ) ;
	} ,
	
	loadPerson : function ( q ) {
		var self = this ;
		self.P = $.extend(true, self.P, self.P_all, self.P_person,self.P_websites);
		self.main_type = 'person' ;
		$.each ( self.P_person , function ( k , v ) { self.to_load.push("P"+v) } ) ;
		self.loadRest ( function () {
			self.to_load = [] ;
			self.addPropTargetsToLoad ( self.keys2array ( self.wd.items ) , self.P_person ) ;
			self.loadRest ( function () {
				self.showPerson ( q ) ;
			} ) ;
		} ) ;
	} ,

	
	loadTaxon : function ( the_q ) {
		var self = this ;
		self.P = $.extend(true, self.P, self.P_all, self.P_taxon);
		self.main_type = 'taxon' ;

		self.loadBacktrack ( {
			follow : self.taxon_list ,
			preload : [ 105 , 405 , 141 , 183 , 910 ] ,
			wdq : 'tree['+(the_q+'').replace(/\D/g,'')+']['+self.taxon_list.join(',')+']' ,
			callback : function () { self.showTaxon ( the_q ) }
		} ) ;
	} ,
	
	loadLocation : function ( the_q ) {
		var self = this ;
		self.P = $.extend(true, self.P, self.P_all, self.P_location, self.P_websites);
		self.main_type = 'location' ;
		$.getScript ( 'resources/js/map/OpenLayers.js' , function () { self.openlayers_loaded = true ;} ) ; // 'http://www.openlayers.org/api/OpenLayers.js'
		
		self.loadBacktrack ( {
			follow : self.location_props ,
			preload : [ 131,132 ] ,
			wdq : 'tree['+(the_q+'').replace(/\D/g,'')+']['+self.location_props.join(',')+']' ,
			callback : function () {
				self.showLocation ( the_q )
			}
		} ) ;
	} ,




//__________________________________________________________________________________________
// Show types


	showGeneric : function ( q ) {
		var self = this ;
		delete self.P.instance_of ; // So it will show, if set
		self.setTopLink () ;
		self.renderName () ; // Render name
		self.showAliases ( q ) ; // Render aliases
		self.showDescription () ; // Render manual description
		self.showExternalIDs() ; // Render external ID links
		self.showWebsites() ; // Render websites
		self.addSitelinks() ; // Render sitelinks
		self.addBacklinks() ; // Render backlinks
//		self.addMiscData(self.P_location) ; // Render misc data
		self.addOther() ; // Render other properties
		self.addMedia() ; // Render images
		self.finishDisplay () ; // Finish
		$('div.other h2').remove() ;
	} ,


	showPerson : function ( q ) {
		var self = this ;
		
		$.each ( [ 'relatives','parents','siblings','children','other' ] , function ( k , v ) {
			$('#person_'+v).html ( self.t('person_'+v) ) ;
		} ) ;
		
		self.showPersonMain ( q ) ;
		self.setTopLink () ;
		self.renderName () ; // Render name
		self.showAliases ( q ) ; // Render aliases
		self.showDescription () ; // Render manual description
		self.showAutoDescPerson () ; // Render automatic description
		self.showExternalIDs() ; // Render external ID links
		self.showWebsites() ; // Render websites
		self.addSitelinks() ; // Render sitelinks
		self.addBacklinks() ; // Render backlinks
//		self.addMiscData(self.P_location) ; // Render misc data
		self.addOther() ; // Render other properties
		self.addMedia() ; // Render images
		self.addSignature() ; // Render signature
		self.finishDisplay () ; // Finish
	} ,
	
	showTaxon : function ( q ) {
		var self = this ;

		// RENDERING
		var h = '' ;
		self.setTopLink () ;
		self.renderName () ; // Render name
		self.showAliases ( q ) ; // Render aliases
		self.showDescription () ; // Render manual description
//		self.showMaps() ; // Render maps
		self.showExternalIDs() ; // Render external ID links
//		self.showWebsites() ; // Render websites
		self.addSitelinks() ; // Render sitelinks
		self.addBacklinks() ; // Render backlinks
//		self.addMiscData(self.P_location) ; // Render misc data
		self.addOther() ; // Render other properties
		self.addMedia() ; // Render images

    function microtime(get_as_float) {  
        // Returns either a string or a float containing the current time in seconds and microseconds    
        //   
        // version: 812.316  
        // discuss at: http://phpjs.org/functions/microtime  
        // +   original by: Paulo Ricardo F. Santos  
        // *     example 1: timeStamp = microtime(true);  
        // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000  
        var now = new Date().getTime() / 1000;  
        var s = parseInt(now);  
      
        return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;  
    }  
    
		// Render taxon chain
//		var chain = self.wd.getItem(q).followChain({props:self.taxon_list}) ;
		var chain = self.findLongestPath ( { start:q , props:self.taxon_list } ) ;
		
		
		h = "<h2>" + self.t('taxonomy') + "</h2>" ;
		h += self.renderChain ( chain , [
			{ title:self.t('rank') , prop:105 , default:'<i>(unranked)</i>' } ,
			{ title:self.t('name') , name:true } ,
			{ title:self.t('taxonomic_name') , prop:225 , default:'&mdash;' , type:'string' , ucfirst:true } ,
		] ) ;

		if ( self.use_wdq ) {
			var url = self.getCurrentUrl ( { live:true } ) ;
			var line = self.t('wdq_notice') ;
			line = line.replace(/\$1/,"<a class='external' style='font-size:8pt' target='_blank' href='http://wikidata-wdq-mm.instance-proxy.wmflabs.org/'>" ) ;
			line = line.replace(/\$2/,"<a href='" + url + "'>" ) ;
			h += "<div style='color:#DDDDDD;font-size:8pt'>" + line + "</div>" ;
		}
		
		// Render taxon properties
		var sd = {} ;
		$.each ( [225,105,405,141,183,427,566] , function ( dummy , p ) {
			p = 'P' + p ;
			var items = self.wd.items[q].getClaimObjectsForProperty(p) ;
			if ( items.length === 0 ) return ;
			if ( sd[p] === undefined ) sd[p] = {} ;
			$.each ( items , function ( k , v ) {
				if ( sd[p][v.key] === undefined ) sd[p][v.key] = [] ;
				sd[p][v.key].push ( $.extend(true,{type:'item',mode:1},v) ) ;
			} ) ;
		} ) ;
		self.renderPropertyTable ( sd , { id:'#taxon div.props',striped:true,title:self.t('taxon_props'),ucfirst:true } ) ;

		self.finishDisplay ( h ) ; // Finish
	} ,
	
	findLongestPath : function ( o ) {
		var self = this ;
		var props = [] ;
		$.each ( o.props , function ( dummy , p ) { props.push ( 'P'+(p+'').replace(/\D/g,'') ) } ) ;
		
		var tree = {} ;
		
		function preset ( qs ) {
			var new_q = [] ;
			$.each ( qs , function ( dummy , q ) {
				if ( undefined !== tree[q] ) return ;
				tree[q] = [] ;
				$.each ( props , function ( dummy , p ) {
					var q2 = self.wd.items[q].getClaimItemsForProperty(p) ;
					$.each ( q2 , function ( k , v ) {
						if ( -1 != $.inArray ( v , new_q ) ) return ;
						new_q.push ( v ) ;
						tree[q].push ( v ) ;
					} ) ;
				} ) ;
				preset ( new_q ) ;
			} ) ;
		}
		
		preset ( [ o.start ] ) ;
		
	
		function iterate ( qs ) {
			var nqs = [] ;
			$.each ( qs , function ( dummy , i ) {
				var sub_q = [] ;
				$.each ( tree[i.q] , function ( dummy2 , v ) {
					if ( -1 != $.inArray ( v , i.hist ) ) return ;
					sub_q.push ( v ) ;
				} ) ;
				
				$.each ( sub_q , function ( k , v ) {
					var nh = i.hist.slice() ;
					nh.push ( v ) ;
					nqs.push ( { q:v , hist: nh } ) ;
				} ) ;
				
			} ) ;
			
			if ( nqs.length > 0 ) {
				qs = [] ;
				return iterate ( nqs ) ;
			} else {
				var longest = [] ;
				$.each ( qs , function ( dummy , i ) {
					if ( i.hist.length > longest.length ) longest = i.hist ;
				} ) ;
				return longest ;
			}
			
		}
		
		return iterate ( [ { q:o.start , hist:[o.start] } ] ) ;
	} ,


	showLocation : function ( q ) {
		var self = this ;
		if ( !self.openlayers_loaded ) { // Race condition
			setTimeout ( function(){self.showLocation(q)} , 50 ) ;
			return ;
		}
		delete self.P.instance_of ; // So it will show, if set
		
		// RENDERING
		var h = '' ;
		self.setTopLink () ;
		self.renderName () ; // Render name
		self.showAliases ( q ) ; // Render aliases
		self.showDescription () ; // Render manual description
		self.showMaps() ; // Render maps
		self.showExternalIDs() ; // Render external ID links
		self.showWebsites() ; // Render websites
		self.addSitelinks() ; // Render sitelinks
		self.addBacklinks() ; // Render backlinks
		self.addMiscData(self.P_location) ; // Render misc data
		
//		var chain = self.wd.getItem(q).followChain({props:self.location_props}) ;
		var chain = self.findLongestPath ( { start:q , props:self.location_props } ) ;
		h = "<h2>" + self.t('location') + "</h2>" ;
		h += self.renderChain ( chain , [
			{ title:self.t('name') , name:true } ,
			{ title:self.t('description') , desc:true } ,
			{ title:self.t('admin_division') , prop:132 } ,
		] ) ;

		if ( self.use_wdq ) {
			var url = self.getCurrentUrl ( { live:true } ) ;
			var line = self.t('wdq_notice') ;
			line = line.replace(/\$1/,"<a class='external' style='font-size:8pt' target='_blank' href='http://wikidata-wdq-mm.instance-proxy.wmflabs.org/'>" ) ;
			line = line.replace(/\$2/,"<a href='" + url + "'>" ) ;
			h += "<div style='color:#DDDDDD;font-size:8pt'>" + line + "</div>" ;
		}

		self.P['type_of_administrative_division'] = 132 ;
		$.each ( self.location_props , function ( k , v ) {
			self.P['P'+v] = v ; // Prevent them showing in "other" list
		} ) ;

		self.addOther() ; // Render other properties
		self.addMedia() ; // Render images
		self.finishDisplay ( h ) ; // Finish
	} ,
	
	getCurrentUrl : function ( o ) {
		var self = this ;
		var url = ( o.hash ) ? '#' : '?' ;
		url += "q=" + self.q ;
		var lang = '' ;
		if ( self.params.lang != 'en' && self.params.lang != '' ) lang = "&lang=" + self.params.lang ;
		if ( undefined !== o.lang ) lang = o.lang ;
		if ( undefined === o.live ) o.live = self.params.live !== undefined ;
		if ( o.live ) url += "&live" ;
		return url ;
	} ,


//__________________________________________________________________________________________
// PERSON details

	addSignature : function () {
		var self = this ;
		var im = self.wd.items[self.q].getMultimediaFilesForProperty ( self.P.signature ) ;
		if ( im.length > 0 ) {
			var io = { file:im[0] , type:'image' , id:'#person .signature' , title:im[0] , tw:220 , th:200 } ;
			self.mm_load.push ( io ) ;
		}
	} ,


	showPersonMain : function ( q ) {
		var self = this ;
		var rel = {} ;
		rel[q] = {} ;
		$.each ( self.wd.items , function ( dummy , item ) {
			var cq = item.getID() ;
			if ( item.hasClaimItemLink ( self.P.sex , self.Q.male ) ) item.gender = 'M' ;
			else if ( item.hasClaimItemLink ( self.P.sex , self.Q.female ) ) item.gender = 'F' ;
			else if ( item.hasClaimItemLink ( self.P.entity_type , self.Q.person ) ) item.gender = '?' ;
			
			$.each ( self.personal_relation_list , function ( dummy2 , p ) {
				var items = item.getClaimObjectsForProperty ( p ) ;
				if ( items.length == 0 ) return ;
				if ( undefined === rel[cq] ) rel[cq] = {} ;
				if ( undefined === rel[cq][p] ) rel[cq][p] = [] ;
				$.each ( items , function ( k1 , v1 ) {
					v1.source_q = item.getID();
					v1.target_q = v1.q ;
					rel[cq][p].push ( v1 ) ;
				} ) ;
			} ) ;
		} ) ;
		
		var relations = { parents : {} , siblings : {} , children : {} , other : {} } ;
		var has_relations = false ;
		
		// Setting relations from main item
		$.each ( rel[q] , function ( p , ql ) {
			var section ;
			if ( p == self.P.father || p == self.P.mother) section = 'parents' ;
			else if ( p == self.P.brother || p == self.P.sister ) section = 'siblings' ;
			else if ( p == self.P.child ) section = 'children' ;
			else section = 'other' ;
			if ( relations[section][p] === undefined ) relations[section][p] = {} ;
			$.each ( ql , function (k,v){
				if ( relations[section][p][v.key] === undefined ) relations[section][p][v.key] = [] ;
				relations[section][p][v.key].push ( $.extend(true,{type:'item',mode:1},v) ) ;
				has_relations = true ;
			} ) ;
		} ) ;
		
		// Setting relations "in reverse" from all other items
		$.each ( rel , function ( cq , props ) {
			if ( cq == q ) return ;
			$.each ( props , function ( p , ql ) {
				$.each ( ql , function ( k , v ) {
					if ( v.type != 'item' || v.key != q ) return ; // Does not refer to main item
					var section ;
					var real_p = p ;
					var val = {type:'item',mode:1} ;
					if ( p == self.P.father || p == self.P.mother) {
						section = 'children' ;
						real_p = self.P.child ;
					} else if ( p == self.P.brother || p == self.P.sister ) {
						section = 'siblings' ;
						if ( self.wd.items[cq].gender == 'M' ) real_p = self.P.brother ;
						else if ( self.wd.items[cq].gender == 'F' ) real_p = self.P.sister ;
						else val = {type:'item',mode:2} ;
					} else if ( p == self.P.child ) {
						section = 'parents' ;
						if ( self.wd.items[cq].gender == 'M' ) real_p = self.P.father ;
						else if ( self.wd.items[cq].gender == 'F' ) real_p = self.P.mother ;
						else val = {type:'item',mode:2} ;
					} else {
						section = 'other' ;
						if ( p != self.P.spouse ) val = {type:'item',mode:2} ;
					}
					val.q = cq ;
					val.key = val.q ;
					val.qualifiers = $.extend(true,{},v.qualifiers);
//					if ( val.q === undefined ) return ;
					if ( relations[section][real_p] === undefined ) relations[section][real_p] = {} ;
					if ( relations[section][real_p][cq] === undefined ) { // Do not overwrite "1" with "2"
						relations[section][real_p][cq] = [] ;
						relations[section][real_p][cq].push ( val ) ;
					}
				} ) ;
			} ) ;
		} ) ;

		// Siblings by same father/mother
		var parents = [] ;
		$.each ( relations['parents'] , function ( cp , cd ) {
			$.each ( cd , function ( cq , dummy ) {
				parents.push ( cq ) ;
			} ) ;
		} ) ;
		
		$.each ( parents , function ( dummy , par ) {
			if ( undefined === rel[par] ) return ;
			if ( undefined === rel[par][self.P.child] ) return ;
			$.each ( rel[par][self.P.child] , function ( k , v ) {
				if ( v.type != 'item' ) return ;
				if ( v.key == q ) return ; // Refers to main item, had that
				var section = 'siblings' ;
				var real_p ;
				var val = {type:'item',mode:1} ;
				if ( self.wd.items[v.key] === undefined ) val = {type:'item',mode:2} ;
				else if ( self.wd.items[v.key].gender == 'M' ) real_p = self.P.brother ;
				else if ( self.wd.items[v.key].gender == 'F' ) real_p = self.P.sister ;
				else val = {type:'item',mode:2} ;
				val.q = v.key ;
				val.key = val.q ;
				val.qualifiers = $.extend(true,{},v.qualifiers);

					if ( relations[section][real_p] === undefined ) relations[section][real_p] = {} ;
					if ( relations[section][real_p][v.key] === undefined ) { // Do not overwrite "1" with "2"
						relations[section][real_p][v.key] = [] ;
						relations[section][real_p][v.key].push ( val ) ;
					}
//				if ( relations[section][real_p] === undefined ) relations[section][real_p] = {} ;
//				if ( relations[section][real_p][v.key] === undefined ) relations[section][real_p][v.key] = val ; // Do not overwrite "1" with "2"
			} ) ;
		} ) ;
		
		if ( !has_relations ) {
			$('div.personal_relations').hide() ;
			return ;
		}

		// Render relatives
		var geneawiki_url = "geneawiki2/?q="+escattr(q) ;
		$('#pr_full_tree').html ( self.t('family_tree') + ": <a class='internal' href='#'>"+self.t('inline')+"</a>/<a target='_blank' href='"+geneawiki_url+"' class='external'>"+self.t('new_page')+"</a>" ) ;
		$('#pr_full_tree a.internal').click ( function () { self.showGeneawiki(); return false } ) ;
		
		$.each ( relations , function ( section , sd ) {
			self.renderPropertyTable ( sd , { id:'#pr_'+section,internal:true } ) ;
		} ) ;
	} ,
	

	showAutoDescPerson : function () {
		var self = this ;
		var q = self.q ;
		var h = [] ;
		h.push ( self.getItemLinks ( q , { p:self.P.sex,q_desc:true,desc:true } ) . join ( ' ' ) ) ;
		h.push ( self.getItemLinks ( q , { p:self.P.occupation,q_desc:true,desc:true } ) . join ( '/' ) ) ;
		var country = self.getItemLinks ( q , { p:self.P.nationality,q_desc:true,desc:true } ) . join ( ' ' ) ;
		if ( country != '' ) h.push ( self.t('from') ) ;
		h.push ( country ) ;
		h = $.trim(h.join(' ').replace(/\s+/g,' ')) ;
		$('#person div.autodesc').html ( h ) ;
	} ,



//__________________________________________________________________________________________
// Show parts


	adjustSitelinksHeight : function () {
		var self = this ;
		var qr_code_height = 200 ;
		var type = self.main_type ;
		var min_height = parseInt($('#'+type+' div.sitelinks').css('min-height')) ;
		var h = parseInt($('#main').height())-parseInt($('#'+type+' div.sitelinks').position().top)+parseInt($('#main').position().top);
		if ( self.showQRLink ) h -= qr_code_height ; // QR code
		if ( h < min_height ) h = min_height ;
		$('#'+type+' div.sitelinks').css({'max-height':h+'px'})
	} ,

	renderChain : function ( chain , columns ) {
		var self = this ;
		var h = '' ;
		h += "<table class='table table-condensed table-striped chaintable'><thead><tr>" ;
		$.each ( columns , function ( k , v ) {
			h += "<th nowrap>" + v.title + "</th>" ;
		} ) ;
		h += "</tr></thead><tbody>" ;
		while ( chain.length > 0 ) {
			var q = chain.pop() ;
			h += "<tr>" ;
			$.each ( columns , function ( k , v ) {
				if ( v.name ) {
					h += "<td nowrap>" + self.getItemLink ( { type:'item',q:q } , {ucfirst:true,desc:true,q_desc:true,internal:true} )  + "</td>" ;
				} else if ( v.desc ) {
					h += "<td>" + self.wd.items[q].getDesc() + "</td>" ;
				} else if ( undefined !== v.prop ) {
					var h2 = v.default || '' ;
					var c = self.wd.items[q].getClaimsForProperty('P'+v.prop) ;
					if ( c.length > 0 ) {
						if ( v.type == 'string' ) {
							h2 = [] ;
							$.each ( c , function ( k2 , v2 ) {
								var s = self.wd.items[q].getClaimTargetString(v2) ;
								if ( v.ucfirst ) s = ucFirst ( s ) ;
								if ( undefined !== s && s != '' ) h2.push ( s ) ;
							} ) ;
							h2 = h2.join ( "<br/>" ) ;
							if ( h2 == '' ) h2 = v.default || '' ;
//							h2 = self.wd.items[q].getClaimTargetString(c[0]) || h2 ;
						} else {
							h2 = [] ;
							$.each ( c , function ( k2 , v2 ) {
								var s = self.wd.items[q].getClaimTargetItemID(v2) ;
								if ( undefined !== self.wd.items[s] ) h2.push ( self.getItemLink ( { type:'item',q:s } , {ucfirst:true,desc:true,q_desc:true} ) ) ;
								else h2.push ( s ) ;
							} ) ;
							h2 = h2.join ( "<br/>" ) ;
							if ( h2 == '' ) h2 = v.default || '' ;
//							c = self.wd.items[q].getClaimTargetItemID(c[0]) ;
//							if ( undefined !== self.wd.items[c] ) h2 = self.getItemLink ( { type:'item',q:c } , {ucfirst:true,desc:true,q_desc:true} ) ;
						}
					}
					h += "<td>" + h2 + "</td>" ;
				} else {
					h += "<td>ERROR</td>" ;
				}
			} ) ;
			h += "</tr>" ;
		}
		h += "</tbody></table>" ;
		return h ;
	} ,


	showAliases : function ( q ) {
		var self = this ;
		var h = [] ;
		$.each ( self.wd.items[q].getAliases() , function ( k , v ) {
			h.push ( "<div class='alias'>" + v.replace(/\s/g,'&nbsp;') + "</div>" ) ;
		} ) ;
		h = h.join ( ' | ' ) ;
		$('#'+self.main_type+' div.aliases').html ( h ) ;
	} ,

	setTopLink : function () {
		var self = this ;
		var h = self.t('item')+" " + self.getItemLink ( { type:'item',q:self.q } , { show_q:true,desc:true,force_external:true } ) ;
		h = "<div style='float:right'><a target='_blank' style='color:#BBB' href='//meta.wikimedia.org/wiki/Reasonator/interface'>" + self.t('translate_interface') + "</a></div>" + h ;
		$('#top').html ( h ) ;
	} ,
	
	renderName : function () {
		var self = this ;
		var label = self.wd.items[self.q].getLabel() ;
		if ( label == self.q ) { // No "common" label, pick one
			var item = reasonator.wd.getItem(self.q).raw ;
			if ( undefined !== item && undefined !== item.labels ) {
				$.each ( item.labels , function ( k , v ) { label = v.value ; } ) ;
			}
		}
		$('#'+self.main_type+' h1.main_title').html ( label ) ;
		self.setDocTitle ( self.wd.items[self.q].getLabel() ) ;
	} ,
	
	
	showDescription : function () {
		var self = this ;
		$('#'+self.main_type+' div.manual_description').html ( self.wd.items[self.q].getDesc() ) ;
	} ,

	setRTL : function () {
		var self = this ;
		self.isRTL = ( self.allow_rtl && -1 < $.inArray ( self.wd.main_languages[0] , [ 'fa','ar','ur','dv','he' ] ) ) ;
		if ( self.isRTL ) {
			$('#main_content').css ( { 'direction':'RTL' } ) ;
			$('div.sidebar').css({'float':'left'}) ;
			$('td,th').css({'text-align':'right'}) ;
			$('div.sidebar th').css({'text-align':'center'}) ;
			setTimeout ( function(){$('table.chaintable td,table.chaintable th').css({'text-align':'right'})} , 100 ) ;
		}
	} ,
	
	finishDisplay : function ( h ) {
		var self = this ;
		$.each ( self.mm_load , function ( k , v ) {
			if ( k >= self.max_related_media ) {
				$(v.id).remove() ;
			} else {
				self.multimediaLazyLoad ( v ) ;
			}
		} ) ;
		self.mm_load = [] ;

		self.setRTL() ;

		if ( undefined !== h ) $('#'+self.main_type+' .main').html ( h ) ;
		$('#'+self.main_type).show() ;
		
		if ( self.use_js_refresh ) {
			$('#'+self.main_type+' a').each ( function ( k , v ) {
				if ( !$(v).hasClass('q_internal') ) return ;
				$(v).click ( function () {
					var a = $(this) ;
					var m = a.attr('href').match ( /\bq=q{0,1}(\d+)/ ) ;
					if ( m == null ) return true ; // Load URL
					var q = 'Q' + m[1] ;
					self.q = q ;
					self.reShow() ;
					return false ;
				} ) ;
			} ) ;
		}

		if ( undefined !== self.do_maps ) {
			setTimeout ( function () {
				$.each ( self.do_maps , function ( k , v ) {
					self.setMap ( v[0] , v[1] , v[2] ) ;
				} ) ;
			} , 100 ) ;
		}
		
		self.addHoverboxes () ;
				
		if ( self.use_autodesc && !self.use_hoverbox ) {
			var x = {} ;
			$.each ( self.autodesc_items , function ( dummy , q ) {
				x[q] = 1 ;
			} ) ;
			
			$.each ( x , function ( q , dummy ) {
				wd_auto_desc.loadItem ( q , { target:$('small.autodesc_'+q) , reasonator_lang:(self.params.lang||'en') , links:'reasonator_local' } ) ;
			} ) ;
		}
		
		if ( self.showConceptCloudLink ) {
			var h = "<div class='concept_cloud'><a class='external' target='_blank' href='http://tools.wmflabs.org/wikidata-todo/cloudy_concept.php?q="+self.q+"&lang="+self.wd.main_languages[0]+"'>"+self.t('concept_cloud')+"</a></div>" ;
			$('#'+self.main_type+' div.sidebar').append ( h ) ;
		}
		
		self.showQRcode() ;
		self.adjustSitelinksHeight() ;
	} ,
	
	showQRcode : function () {
		var self = this ;
		if ( !self.showQRLink ) return ;
		var sites = self.wd.getItem(self.q).getWikiLinks() || {} ;
		var site ;
		$.each ( self.wd.main_languages , function ( dummy , l ) {
			if ( sites[l+'wiki'] === undefined ) return ;
			site = sites[l+'wiki'] ;
			return false ;
		} ) ;
		if ( site === undefined ) {
			$.each ( sites, function ( k , v ) {
				if ( !k.match(/^.+wiki$/ ) ) return ;
				site = v ;
				return false ;
			} ) ;
		}
		if ( site === undefined ) return ;
		
		var m = site.site.match ( /^(.+)wiki$/ ) ;
		var l = m[1] ;
		var url_title = escape(site.title.replace(/\s/g,'_')) ;
		var qrpedia_url = "http://" + l + ".qrwp.org/" + url_title ;
		var qrp_url = "//qrpedia.wikimedia.org.uk/qr/php/qr.php?size=800&download="+url_title+"%20QRpedia&e=L&d=" + qrpedia_url ;
		var qr_img = "<a title='"+self.t('qrpedia')+"' href='"+qrpedia_url+"' target='_blank'><img width='200px' src='" + qrp_url + "' /></a>" ;
		var h = '<div style="text-align:center" class="qrcode"></div>' ;
		$('#'+self.main_type+' div.sidebar').append ( h ) ;
		if ( true ) { // Direct QR code show
			$('div.qrcode').html ( qr_img ) ;
			self.adjustSitelinksHeight();
		} else {
			$('div.qrcode').html ( '<a href="#">Show QR code</a>' ) ;
			$('div.qrcode a').click ( function () {
				$('div.qrcode').html ( qr_img ) ;
				return false ;
			} ) ;
		}

	} ,
	
	addHoverboxes : function  () {
		var self = this ;
		if ( !self.use_hoverbox ) return ;
		var pl = (self.params.lang||'en').split(',')[0] ; // Main parameter language
		wd_auto_desc.lang = pl ;
		var icons = {
			wiki:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/18px-Wikipedia-logo-v2.svg.png' ,
			wikivoyage:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Wikivoyage-logo.svg/18px-Wikivoyage-logo.svg.png' ,
			wikisource:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wikisource-logo.svg/18px-Wikisource-logo.svg.png'
		} ;

		$('a.q_internal').cluetip ( { // http://plugins.learningjquery.com/cluetip/#options
			splitTitle:'|',
			multiple : false,
			sticky : true ,
			mouseOutClose : 'both' ,
			cluetipClass : 'myclue' ,
			leftOffset : 0 ,
//				delayedClose : 500 ,
			onShow : function(ct, ci) { // Outer/inner jQuery node
				var a = $(this) ;
				var qnum = a.attr('q').replace(/\D/g,'') ;
				var q = 'Q'+qnum ;
				var i = reasonator.wd.items[q] ;
				var title = i.getLabel() ;
				var dl = i.getLabelDefaultLanguage() ;

				var h = "" ;
				h += "<div><span style='margin-right:10px;font-size:12pt'><a class='wikidata' target='_blank' href='//www.wikidata.org/wiki/Q"+qnum+"'>Q"+qnum+"</a></span>" ;
				
				var sl = i.getWikiLinks() ;
				$.each ( [ 'wiki' , 'wikivoyage' , 'wikisource' ] , function ( dummy , site ) {
					var s2 = site=='wiki'?'wikipedia':site ;
					if ( sl[pl+site] != undefined ) h += "<span style='margin-left:5px'><a title='"+self.t('sl_'+s2)+" "+self.all_languages[pl]+"' target='_blank' href='//"+pl+"."+s2+".org/wiki/"+escape(sl[pl+site].title)+"'><img border=0 src='"+icons[site]+"'/></a></span>" ;
				} ) ;
				var commons = i.getClaimObjectsForProperty ( 373 ) ;
				if ( commons.length > 0 ) {
					h += "<span style='margin-left:5px'><a title='"+self.t('commons_cat')+"' target='_blank' href='//commons.wikimedia.org/wiki/Category:"+escape(commons[0].s)+"'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Commons-logo.svg/18px-Commons-logo.svg.png' border=0 /></a></span>" ;
				}
				h += "</div>" ;
				
				
				if ( dl != pl ) {
					h += "<div style='font-size:9pt;border-bottom:1px dotted red'><i>" ;
					h += self.t('no_label_in').replace(/\$1/g,self.all_languages[pl]||pl) ;
					h += "</i>" ;
					if ( self.allowLabelOauthEdit ) {
						h += "<br/><a href='#' onclick='reasonator.addLabelOauth(\""+q+"\",\""+pl+"\");return false'><b>Add a label</b></a> (via <a target='_blank' href='/widar'>WiDaR</a>)" ;
					}
					h += "</div>" ;
				}

				h += "<div>" + i.getDesc() + "</div>" ;
			
				var adid = 'cluetip_autodesc_'+q ;
				if ( self.use_autodesc ) {
					h += "<div id='"+adid+"'>...</div>" ;
				}
			
			
				ct.css({'background-color':'white'}) ; // TODO use cluetipClass for real CSS
				var title_element = $(ct.find('h3')) ;
				title_element.html ( title ) ;
				ci.attr({q:q}) ;
				ci.html ( h ) ;
				if ( self.isRTL ) ci.css ( { 'direction':'RTL' } ) ;

				var images = i.getMultimediaFilesForProperty(18);
				if ( images.length > 0 ) {
					var img = images[0] ;
					$.getJSON ( '//commons.wikimedia.org/w/api.php?callback=?' , {
						action:'query',
						titles:'File:'+img,
						prop:'imageinfo',
						format:'json',
						iiprop:'url',
						iiurlwidth:120,
						iiurlheight:300
					} , function ( d ) {
						if ( d.query === undefined || d.query.pages === undefined ) return ;
						$.each ( d.query.pages , function ( dummy , v ) {
							if ( v.imageinfo === undefined ) return ;
							var ii = v.imageinfo[0] ;
							var h = "<div style='float:right'><img src='"+ii.thumburl+"' /></div>" ;
							if ( ci.attr('q') != q ) return ;
							$('#cluetip').css({width:'400px'});
							ci.prepend ( h ) ;
						} ) ;
					} ) ;
				}

				if ( self.use_autodesc ) {
					wd_auto_desc.loadItem ( q , { target:$('#'+adid) , reasonator_lang:(self.params.lang||'en') , links:'reasonator_local' } ) ;
				}
			}
		} ) ;
	} ,
		
	
	addLabelOauth : function ( q , lang ) {
		var a = $('a.q_internal[q="'+q.replace(/\D/g,'')+'"]') ;
		var self = reasonator ;
		var label = prompt ( "New label in " + self.all_languages[lang] , "" ) ;
		
		if(label == "" || label == null) return ;

		$.getJSON ( '/widar/index.php?callback=?' , {
			action:'set_label',
			q:q,
			lang:lang,
			label:label,
			botmode:1
		} , function ( d ) {
			console.log ( d ) ;
			if ( d.error == 'OK' ) {
				a.css({border:'none'}).text ( label ) ;
				reasonator.wd.items[q].raw.labels[lang] = { language:lang , value:label } ;
			} else alert ( d.error ) ;
		} ) ;
	} ,
	
	
	addMiscData : function ( props ) {
		var self = this ;
		var i = self.wd.items[self.q] ;
		var q = self.q ;
		
		var sd = {} ;
		$.each ( props , function ( dummy , p ) {
			if ( self.P_url[p] !== undefined ) return ;
			p = 'P' + p ;
			var items = self.wd.items[q].getClaimObjectsForProperty(p) ;
			if ( items.length === 0 ) return ;
			if ( sd[p] === undefined ) sd[p] = {} ;
			$.each ( items , function ( k , v ) {
				if ( sd[p][v.key] === undefined ) sd[p][v.key] = [] ;
				sd[p][v.key].push ( $.extend(true,{type:'item',mode:1},v) ) ;
			} ) ;
		} ) ;
		
		var id = '.entity_'+self.main_type+' .misc_data' ;
		self.renderPropertyTable ( sd , { id:id , striped:true } ) ;
		id += " table" ;
		$(id).removeClass('table').removeClass('table-condensed').addClass('sidebar-table') ;
		$(id).prepend("<thead><th colspan=2>"+self.t('external_ids')+"</th></thead>") ;
		$(id+' th').css({'min-width':''}) ;
		$(id+' td').css({'width':''}) ;
	} ,
	
	showMaps : function () {
		var self = this ;
		var i = self.wd.items[self.q] ;
		var claims = i.getClaimsForProperty ( 242 ) ; // Locator map
		var hide_maps = true ;
		
		if ( claims.length > 0 ) {
			hide_maps = false ;
			var s = i.getClaimTargetString ( claims[0] ) ;
			delete self.wd.items[self.q].raw.claims['P242'] ; // Prevent showing up later

			$('#'+self.main_type+' div.locator_map').html('<img/>') ;
			self.imgcnt++ ;
			var io = { file:s , type:'image' , id:'#imgid'+self.imgcnt , title:self.wd.items['P242'].getLabel() } ;
			io.tw = 220 ;
			io.th = 220 ;
			io.id = '#'+self.main_type+' div.locator_map img' ;
			io.append = true ;
			self.mm_load.push ( io ) ;
		}


		claims = i.getClaimsForProperty ( 625 ) ; // Coordinate location
		
		if ( claims.length > 0 ) {
			hide_maps = false ;
			var v = claims[0].mainsnak.datavalue.value ;
			self.maps = [] ;
			self.do_maps = [
				[ v , 'location_map1' , 3 ] ,
				[ v , 'location_map2' , 5 ]
			] ;
		}
		
		if ( hide_maps ) $('.entity .maps').hide() ;
		else $('.entity .maps').show() ;

	} ,

	setMap : function ( v , id , zoom ) {

		var self = this ;
		var map = new OpenLayers.Map(id);
		map.addLayer(new OpenLayers.Layer.OSM());

		var markers = new OpenLayers.Layer.Markers( "Markers" );
		map.addLayer(markers);

		var lonLat = new OpenLayers.LonLat( v.longitude , v.latitude )
			  .transform(
				new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
				map.getProjectionObject() // to Spherical Mercator Projection
			  );
			  
		var marker = new OpenLayers.Marker(lonLat) ;
		markers.addMarker(marker);

		var lonLat = new OpenLayers.LonLat( v.longitude , v.latitude )
			  .transform(
				new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
				map.getProjectionObject() // to Spherical Mercator Projection
			  );
		map.setCenter (lonLat, zoom);
	} ,
	

	setDocTitle : function ( s ) {
		document.title = s + ' - Reasonator' ;
	} ,
	
	addMedia : function () {
		var self = this ;
		var has_header = false ;

		$.each ( ['video','audio','voice_recording','wikivoyage_banner','coa','seal','flag_image','range_map','image'] , function ( dummy1 , medium ) {
			$.each ( self.wd.items , function ( k , v ) {
				if ( v.isPlaceholder() || !v.isItem() ) return ;
				if ( v.getID() != self.q && medium != 'image' ) return ; // Don't show non-image media from other items; show those inline instead
				if ( v.getID() != self.q && -1 != $.inArray ( v.getID() , ['Q5','Q2']) ) return ; // No often-used images in related media
				var im = v.getMultimediaFilesForProperty ( self.P[medium] ) ;
				$.each ( im , function ( k2 , v2 ) {
					self.imgcnt++ ;
					var medium2 = medium ;
					if ( medium == 'voice_recording' ) medium2 = 'audio' ;
					var io = { file:v2 , type:medium2 , id:'#imgid'+self.imgcnt , title:v.getLabel() } ;
					if ( self.q == v.getID() && k2 == 0 ) { // ( k2 == 0 || medium2 == 'audio' )
						io.tw = 220 ;
						io.th = 400 ;
						io.id = '#'+self.main_type+' div.main_'+medium2 ;
						io.append = true ;
						if ( medium == 'coa' || medium == 'seal' || medium == 'wikivoyage_banner' || medium == 'flag_image' || medium == 'range_map' ) io.type = 'image' ;
						if ( medium == 'wikivoyage_banner' ) io.tw = self.banner_width ;
					} else {
						if ( !has_header ) {
							$('#'+self.main_type+' div.all_images').append ( "<div id='related_media_container'><h2>"+self.t('related_media')+"</h2><div id='related_media_meta'></div></div>" ) ;
							has_header = true ;
						}
						var h3 = "<div class='mythumb' id='imgid" + self.imgcnt + "'>...</div>" ;
						if ( medium2 == 'audio' ) {
							h3 = "<div>" + h3 + " <span style='font-size:9pt'>" + io.file + "</span></div>" ;
						}
						$('#'+self.main_type+' div.all_images').append ( h3 ) ;
					}
					self.mm_load.push ( io ) ;
				} ) ;
			} ) ;
		} ) ;

		$.each ( [ 373 , 935 ] , function ( dummy , prop ) {
			if ( self.wd.items[self.q].hasClaims ( prop ) ) { // Commons cat
				if ( self.wd.items['P'+prop] === undefined ) return ;
				var ct = self.wd.items['P'+prop].getLabel()  ;
				if ( !has_header ) {
					$('#'+self.main_type+' div.all_images').append ( "<h2>"+self.t('related_media')+"</h2><div id='related_media_meta'></div>" ) ;
					has_header = true ;
				}
				var c = self.wd.items[self.q].getClaimsForProperty ( prop ) ;
				$.each ( c , function ( k , v ) {
					var s = self.wd.items[self.q].getClaimTargetString ( v ) ;
					var h = "<div>" + ct + " : <a target='_blank' title='"+ct+"' class='external' href='//commons.wikimedia.org/wiki/" ;
					if ( prop == 373 ) h += 'Category:' ;
					h += escattr(s)+"'>" + s + "</a></div>" ;
					$('#related_media_meta').append ( h ) ;
				} ) ;
			}
		} ) ;
		
	} ,
	
	/*
	Parameters:
	- sd : { prop : { q : 1/2 , ... } , ... }
	       q:2 means "of"
	*/
	renderPropertyTable : function ( sd , o ) {
		var self = this ;
		var h = '' ;
		var no = $.extend(true, {}, o);
		no.gender = true ;
		no.desc = true ;
		no.q_desc = true ;
		var internal = (o.internal||false) ;
		$.each ( sd , function ( op , qs ) {
			var p = String(op).replace(/\D/g,'') ;
			var ql = [] ;
			$.each ( qs , function ( k , v ) { ql.push ( v ) } ) ;

			var num_rows = 0 ;
			$.each ( ql , function ( row , subrow ) { num_rows += subrow.length } ) ;
			
			self.table_block_counter++ ;
			var block_id = 'table_block_'+ self.table_block_counter ;
			var collapse = num_rows >= self.collapse_item_list ;
			var rows = num_rows + (collapse?1:0) ;
			h += "<tr><th style='min-width:20%' valign='top' rowspan='" + rows + "'>" ;
			h += self.getItemLink ( { type:'item',q:'P'+p } , { desc:true } ) ;
			h += "</th>" ;
			var row = 0 ;
			$.each ( ql , function ( dummy , subrow ) {
				no.add_desc = true ;
				$.each ( subrow , function ( dummy , cq ) {
					if ( row > 0 ) h += "<tr>" ;
					h += "<td name='" + block_id + "' style='width:100%" ;
					if ( collapse ) h += ";display:none" ;
					h += "'>" ;
					if ( cq.mode == 2 ) h += self.t('of')+"&nbsp;" ;
					h += self.getItemLink ( cq , no ) ; // { internal:internal,desc:true,gender:true,q_desc:true }
					h += "</td></tr>" ;
					row++ ;
					no.add_desc = false ;
				} ) ;
			} ) ;
			if ( collapse ) {
				h += "<tr><td style='width:100%'>" ;
				h += num_rows + " items. " ;
				h += "<a href='#' name='"+block_id+"' onclick='reasonator.toggleItems(\"" + block_id + "\");return false'>"+self.t('show_items')+"</a>" ;
				h += "<a href='#' name='"+block_id+"' style='display:none' onclick='reasonator.toggleItems(\"" + block_id + "\");return false'>"+self.t('hide_items')+"</a>" ;
				h += "</td></tr>" ;
			}
		} ) ;
		if ( h != '' ) {
			var h2 = "<table" ;
			if ( o.striped ) h2 += " class='table table-striped table-condensed'" ;
			else h2 += " class='table table-condensed'" ;
			h2 += ">" + h + "</table>" ;
			h = h2 ;
		}
		if ( o.title !== undefined && h != '' ) h = "<h2>" + o.title + "</h2>" + h ;
		$(o.id).html(h) ;
//		if ( !o.striped ) $(o.id+' table').removeClass('table').removeClass('table-condensed') ;
	} ,
	
	toggleItems : function ( block_id ) {
		$('a[name="'+block_id+'"]').toggle() ;
		$('td[name="'+block_id+'"]').toggle() ;
	} ,

	addOther : function () {
		var self = this ;
		var sd = {} ;
		var ignore = {} ;
		$.each ( self.P , function ( k , v ) { ignore['P'+v] = 1 } ) ;
		
		var q = self.q ;
		var item = self.wd.items[q] ;
		var props = item.getPropertyList() ;
		$.each ( props , function ( dummy , p ) {
			if ( undefined !== ignore[p] ) return ;
			var ci = item.getClaimObjectsForProperty ( p ) ;
			$.each ( (ci||[]) , function ( dummy2 , ti ) {
				if ( undefined === sd[p] ) sd[p] = {} ;
//				console.log ( ti ) ;
				if ( sd[p][ti.key] === undefined ) sd[p][ti.key] = [] ;
				sd[p][ti.key].push ( $.extend(true,{p:p,mode:1},ti) ) ;
			} ) ;
		} ) ;
		self.renderPropertyTable ( sd , { id:'.entity_'+self.main_type+' .other' , title:self.t('other_properties') , striped:true , add_desc:true , audio:true , video:true } ) ;

	} ,
	

	addBacklinks : function () {
		var self = this ;
		var sd = {} ;
		var ignore = {} ;
		$.each ( self.P , function ( k , v ) { ignore['P'+v] = 1 } ) ;
		$.each ( self.wd.items , function ( q , item ) {
			if ( !item.isItem() ) return ;
			if ( q == self.q ) return ;
			var props = item.getPropertyList() ;
			$.each ( props , function ( dummy , p ) {
				if ( undefined !== ignore[p] ) return ;
				var ci = item.getClaimObjectsForProperty ( p ) ;
				if ( ci.length == 0 ) return ;
				$.each ( ci , function ( dummy2 , ti ) {
					if ( ti.key != self.q ) return ;
					if ( undefined === sd[p] ) sd[p] = {} ;
					var o = {type:'item',mode:1,q:item.getID(),key:item.getID()} ;
					if ( sd[p][q] === undefined ) sd[p][q] = [] ;
					sd[p][q].push ( o ) ;
				} ) ;
			} ) ;
		} ) ;
		self.renderPropertyTable ( sd , { id:'.entity_'+self.main_type+' .backlinks' , title:self.t('from_related_items') , striped:true , add_desc:true , audio:true , video:true } ) ;
	} ,

	showExternalIDs : function () {
		var self = this ;
		var h = [] ;
		var i = self.wd.items[self.q] ;
		$.each ( self.extURLs , function ( k , v ) {
			var p = self.urlid2prop[k] ;
//			var p = self.P[k] ;
			if ( p === undefined ) return ;

			var claims = i.getClaimsForProperty ( p ) ;
			if ( claims.length > 0 ) self.P[k] = p ;
			$.each ( claims , function ( dummy , c ) {
				var id_type = k ;
				var s ;
				var url = '' ;
				if ( p == 553 ) { // Social media
					if ( c.qualifiers === undefined || c.qualifiers['P554'] === undefined ) return ;
					s = c.qualifiers['P554'][0].datavalue.value ;
					var smtype = c.mainsnak.datavalue.value['numeric-id'] ;
					id_type = self.wd.items['Q'+smtype].getLabel();
					if ( smtype == 918 ) url = '//twitter.com/'+s ; // Twitter
				} else {
					s = i.getClaimTargetString ( c ) ;
					url = v.replace(/!ID!/g,escattr(s)) ;
				}
				if ( undefined === s ) return ;
				
				s = s.replace ( /-/g , '-&#8203;' ) ;
				
				
				var h2 = "<tr><td>" + id_type + "&nbsp;</td><td>" ;
				if ( url == '' ) h2 += s ;
				else h2 += "<a target='_blank' href='" + url + "' class='external'>" + s + "</a>" ;
				h2 += "</td></tr>" ;
				h.push ( h2 ) ;
			} ) ;
		} ) ;

		if ( h.length == 0 ) return ;
		h = "<table class='sidebar-table table-striped'><thead><th colspan=2>"+self.t('external_sources')+"</th></thead><tbody>" + h.join('') + "</tbody></table>" ;
		$('.entity_'+self.main_type+' .external_ids').html ( h ) ;
	} ,


	showWebsites : function () {
		var self = this ;
		var h = [] ;
		var i = self.wd.items[self.q] ;
		$.each ( self.P_websites , function ( k , v ) {
			var claims = i.getClaimsForProperty ( v ) ;
			$.each ( claims , function ( dummy , c ) {
				var s = i.getClaimTargetString ( c ) ;
				if ( undefined === s ) return ;
				var url = s ;
				var h2 = "<tr><td><a target='_blank' href='" + url + "' class='external'>" + self.wd.items['P'+v].getLabel() + "</a></td></tr>" ;
				h.push ( h2 ) ;
			} ) ;
		} ) ;
		
		if ( h.length == 0 ) return ;

		h = "<table class='sidebar-table table-striped'><thead><th>"+self.t('external_sites')+"</th></thead><tbody>" + h.join('') + "</tbody></table>" ;
		$('.entity_'+self.main_type+' .websites').html ( h ) ;
	} ,
	
	addSitelinks : function () {
		var self = this ;
		var i = self.wd.items[self.q] ;
		var links = i.getWikiLinks() ;
		var hadthat = {} ;

		var projects = [ 'current' , 'mainwp' , 'commons' , 'wikisource' , 'wikivoyage' , 'wiki' ] ;
		var groups = {
			current : { title:self.t('sl_current') , server:'wikipedia.org' , sites:[] } ,
			
			mainwp : { title:self.t('sl_big_wp') , server:'wikipedia.org' , sites:[] } ,
			commons : { title:self.t('sl_commons') , server:'wikimedia.org' , sites:[] } ,
			wikisource : { title:self.t('sl_wikisource') , server:'wikisource.org' , sites:[] } ,
			wikivoyage : { title:self.t('sl_wikivoyage') , server:'wikivoyage.org' , sites:[] } ,
			wiki : { title:self.t('sl_other') , server:'wikipedia.org' , sites:[] } ,
		} ;
		
		var lp = (self.params.lang||'en').split(',');
		$.each ( lp , function ( dummy , l ) {
			var site = l + 'wiki' ;
			if ( undefined === links[site] || undefined !== hadthat[site] ) return ;
			hadthat[site] = true ;
			groups.current.sites.push ( { code:l , page:links[site].title } ) ;
		} ) ;
		

		if ( undefined !== links['commonswiki'] ) {
			$.each ( links , function ( site , dummy ) {
				if ( site != 'commonswiki' ) return ;
				hadthat[site] = true ;
				groups.commons.sites.push ( { code:'commons' , page:links[site].title } ) ;
			} ) ;
		}
		
		$.each ( self.wd.main_languages , function ( dummy , l ) {
			var site = l + 'wiki' ;
			if ( undefined === links[site] || undefined !== hadthat[site] ) return ;
			hadthat[site] = true ;
			groups.mainwp.sites.push ( { code:l , page:links[site].title } ) ;
		} ) ;
		
		$.each ( projects , function ( dummy , project ) {
			if ( project == 'mainwp' || project == 'current' ) return ;
			var re = new RegExp("^(.+)"+project+"$") ;
			$.each ( links , function ( site , dummy ) {
				var m = re.exec ( site ) ;
				if ( m == null ) return ; // Wrong project
				if ( undefined === links[site] || undefined !== hadthat[site] ) return ;
				hadthat[site] = true ;
				groups[project].sites.push ( { code:m[1] , page:links[site].title } ) ;
			} ) ;
		} ) ;
		
		var h = "<table class='sidebar-table table-striped'>" ; // style='width:100%' border=0 cellspacing=0 cellpadding=1 
		h += "<thead><th colspan=2>"+self.t('wikimedia_projects')+"</th></thead><tbody>" ;
		
		$.each ( projects , function ( dummy , project ) {
			if ( groups[project].sites.length == 0 ) return ;
			if ( project != 'current' ) {
				groups[project].sites = groups[project].sites.sort ( function ( a , b ) {
					return ((a.code < b.code) ? -1 : ((a.code > b.code) ? 1 : 0));
				} ) ;
			} ;
			h += "<tr><th colspan='2'>" + groups[project].title + "</th></tr>" ;
			$.each ( groups[project].sites , function ( dummy , site ) {
				h += "<tr><td>" + site.code + "</td>" ;
				h += "<td><a href='//" + site.code + "."+groups[project].server+"/wiki/" + escattr(site.page) + "' class='wikipedia' target='_blank'>" + site.page + "</a></td></tr>" ;
			} ) ;
		} ) ;

		h += "</tbody></table>" ;
		$('div.sitelinks').html ( h ) ;
	} ,

	getItemLinks : function ( init_q , o ) {
		var self = this ;
		var ret = [] ;
		if ( o === undefined ) return ret ;
		var q = self.wd.convertToStringArray ( init_q , 'Q' ) [0] ;
		if ( self.wd.items[q] === undefined ) return ret ;
		var ql = self.wd.items[q].getClaimObjectsForProperty ( o.p ) ;
		$.each ( ql , function ( dummy , cq ) {
			ret.push ( self.getItemLink ( cq , o ) ) ;
		} ) ;
		return ret ;
	} ,
	
	getQlink : function ( q , o ) {
		var self = this ;
		if ( undefined === q ) return "UNIDENTIFIED ITEM" ;
		var qnum = q.replace(/\D/g,'') ;
		var item = self.wd.items[q] ;
		if ( item === undefined ) {
			return "ITEM NOT LOADED : " + q ;
		}
		var url = item.getURL() ;
		
		var internal = o.internal ;
		if ( self.wd.items[q].isItem() ) {
//			if ( self.isPerson(q) || self.isTaxon(q) || self.isLocation(q) ) 
			internal = true ;
		}
		if ( o.force_external ) internal = false ;
		
		var h = '' ;
		if ( o.gender ) {
			if ( item.gender == 'M' ) h += '♂&nbsp;' ;
			else if ( item.gender == 'F' ) h += '♀&nbsp;' ;
			else if ( item.gender !== undefined ) h += '?&nbsp;' ;
		}
		h += "<a" ;
		if ( internal ) h += " q='"+qnum+"' class='q_internal' href='?lang="+self.wd.main_languages[0]+"&q=" + qnum + "'" ; //h += " href='#' onclick='reasonator.loadQ(" + q.replace(/\D/g,'') + ");return false'" ; // FIXME
		else h += " class='wikidata' target='_blank' href='" + url + "'" ;
		var title = [] ;
		if ( o.desc ) { title.unshift ( item.getDesc() ) ; if ( title[0] == '' ) title.shift() }
		if ( o.q_desc ) { title.push ( q ) }
		if ( title.length > 0 ) h += " title='" + title.join('; ') + "'" ;
		
		if ( self.mark_missing_labels ) {
			var dl = item.getLabelDefaultLanguage() ;
//			h += " dl='" + dl + "'" ;
//			var param_lang = (self.params.lang||'en').split(',') ;
//			if ( -1 == $.inArray ( dl , param_lang ) ) {
			var param_lang = (self.params.lang||'en').split(',')[0] ;
			if ( dl != param_lang ) {
				h += " style='border-bottom:1px dotted red'" ;
			}
		}
		
		h += ">" ;

		var label = o.ucfirst ? ucFirst(item.getLabel()) : item.getLabel() ;
		if ( label == q ) { // No "common" label, pick one
			if ( undefined !== item.raw && undefined !== item.raw.labels ) {
				$.each ( item.raw.labels , function ( k , v ) { label = v.value ; return false } ) ;
			}
		}

		h += label ; //o.ucfirst ? ucFirst(item.getLabel()) : item.getLabel() ;

		h += "</a>" ;
		if ( internal && !self.use_hoverbox ) {
			h += " <span style='font-size:0.6em'><a href='" + url + "' class='wikidata' target='_blank'>WD</a></span>" ;
		}
		
		if ( o.add_desc && !self.use_hoverbox ) {
			var d = item.getDesc()  ;
			h += " <small class='autodesc_"+q+"'>" + d+ "</small>" ;
			if ( d == '' && self.use_autodesc ) {
				self.autodesc_items.push ( q ) ;
			}
		}
		if ( o.show_q ) h += " <small class='qnumber'>(" + q + ")</small>" ;

		var had_video = false ;
		if ( o.video ) {
			var files = item.getMultimediaFilesForProperty ( 10 ) ;
			if ( files.length > 0 ) h += "<br/>" ;
			$.each ( files , function ( k , v ) {
				had_video = true ;
				self.imgcnt++ ;
				h += " <div style='display:inline' id='imgid" + self.imgcnt + "'></div>" ;
				self.mm_load.push ( { file:v , type:'video' , id:'#imgid'+self.imgcnt } ) ;
			} ) ;
		}

		if ( o.audio ) {
			var files = item.getMultimediaFilesForProperty ( 51 ) ;
			if ( files.length > 0 && !had_video ) h += "<br/>" ;
			$.each ( files , function ( k , v ) {
				self.imgcnt++ ;
				h += " <div style='display:inline' id='imgid" + self.imgcnt + "'></div>" ;
				self.mm_load.push ( { file:v , type:'audio' , id:'#imgid'+self.imgcnt } ) ;
			} ) ;
		}
		
		return h ;
	} ,
	
	pad : function (number, length) {
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	} ,
	
	getItemLink : function ( i , o ) {
		var self = this ;
		var ret = "<div style='display:inline'>" ;
		if ( o === undefined ) o = {} ;
		
		if ( i.type == 'string' ) {
			if ( i.p == 'P373' ) ret += "<a target='_blank' title='Category on Commons' class='external' href='//commons.wikimedia.org/wiki/Category:"+escattr(i.s)+"'>" + i.s + "</a>" ; // Commons cat
			else ret += i.s ;
		} else if ( i.type == 'item' ) {
			ret += self.getQlink ( i.q , o ) ;
		} else if ( i.type == 'time' ) {
			var pre = i.time.substr(0,1) == '+' ? 1 : -1 ;
			var dp = i.time.substr(1).split(/[-T:Z]/) ;

			var year = dp[0]*pre ;
			var month = self.pad ( dp[1] , 2 ) ;
			var day = self.pad ( dp[2] , 2 ) ;
			
			var show = i.time ; // Fallback
			var start , end ;
			if ( i.precision <= 9 ) {
				show = year ;
				start = show + '-00-00' ;
				end = show + '-13-32' ;
			} else if ( i.precision == 10 ) {
				show = year + '-' + month ;
				start = show + '-00' ;
				end = show + '-32' ;
			} else if ( i.precision == 11 ) {
				show = year + '-' + month + '-' + day ;
				start = show ;
				end = show ;
			}
			
			if ( undefined !== start && undefined !== end && ( i.p == 'P569' || i.p == 'P570' ) ) {
				var title = i.p == 'P569' ? 'Born' : 'Died' ;
				title += " on that date" ;
				show = "<a target='_blank' title='"+title+"' class='external' href='http://tools.wmflabs.org/wikidata-todo/autolist.html?q=between["+i.p.substr(1)+","+start+","+end+"]'>" + show + "</a>" ;
			}
			
			ret += show ;


		} else {
			console.log ( "UNKNOWN : " + i.type + ' / ' ) ;
			console.log ( i ) ;
			ret += "UNKNOWN" ;
		}
		
		var qual = [] ;
		$.each ( (i.qualifiers||[]) , function ( qp , qv ) {
			var prop = { q:qp,type:'item' } ;
			var qp = self.getItemLink(prop) ;
			$.each ( qv , function ( dummy , v ) {
				var qi = self.getItemLink(v) ;
				qual.push ( qp+' : '+qi ) ;
			} ) ;
		} ) ;
		if ( qual.length > 0 ) ret += "<br/><div style='padding-left:10px;font-size:80%'>" + qual.join('<br/>') + "</div>" ;
		
		ret += "</div>" ;
		return ret ;
	} ,

	multimediaLazyLoad : function ( o ) {
		var self = this ;
		$.getJSON ( '//commons.wikimedia.org/w/api.php?callback=?' , {
			action : 'query' ,
			titles : 'File:' + o.file ,
			prop : 'imageinfo' ,
			iiurlwidth : o.tw||120 ,
			iiurlheight : o.th||120 ,
			iiprop : 'url|size' ,
			format : 'json'
		} , function ( data ) {
			$.each ( data.query.pages , function ( k , v ) {
				if ( undefined !== o.id ) {
					var h ;
					if ( undefined === v.missing ) {
						var maxw = o.tw || 500 ;
						if ( o.type == 'video' ) {
							var url = v.imageinfo[0].url ;
							h = "<video controls style='margin-top:1px;margin-bottom:1px;max-width:"+maxw+"px'><source src='" + url + "' type='video/ogg'><small><i>Your browser <s>sucks</s> does not support HTML5 video.</i></small></video>" ;
						} else if ( o.type == 'audio' ) {
							var url = v.imageinfo[0].url ;
							var type = 'ogg' ;
							if ( null != v.title.match(/\.flac$/i) ) type = 'flac' ;
							if ( type == 'flac' ) { // Hardcoded exception
								h = "<a href='" + url + "' target='_blank'>"+self.t('download_file')+"</a>" ;
							} else {
								h = "<audio controls style='max-width:"+maxw+"px'><source src='" + url + "' type='audio/"+type+"'><small><i>Your browser <s>sucks</s> does not support HTML5 audio.</i></small></audio>" ;
							}
						} else if ( o.type == 'image' ) {
							h = "<img border=0 width='"+v.imageinfo[0].thumbwidth+"px' height='"+v.imageinfo[0].thumbheight+"px' src='" + v.imageinfo[0].thumburl + "' " ;
							if ( o.title !== undefined ) h += "title='" + o.title + "' " ; 
							h += "/>" ;
							h = "<a target='_blank' href='" + v.imageinfo[0].descriptionurl + "'>" + h + "</a>" ;
						}
					} else {
						h = '' ;
					}
					$(o.id).html ( h ) ;
					setTimeout ( function(){self.adjustSitelinksHeight()} , 100 ) ;
				}
			} ) ;
		} ) ;
	} ,

	getRelatedEntities : function ( q , callback ) {
		var self = this ;
		$.getJSON ( '//www.wikidata.org/w/api.php?callback=?' , {
			action : 'query' ,
			list : 'backlinks' ,
			bltitle : q ,
			blnamespace : 0 ,
			bllimit : 500 ,
			format : 'json'
		} , function ( data ) {
//			var ql = [] ;
			$.each ( data.query.backlinks||[] , function ( k , v ) {
				var cq = 'Q' + v.title.replace(/\D/g,'') ;
				self.to_load.push ( cq ) ;
			} ) ;
			callback() ;
//			self.wd.loadItems ( ql , { finished : function ( x ) { callback() } } , 0 ) ;
			
		} ) ;
	} ,
	
	
	find : function ( s ) {
		var self = this ;
		var offset = self.params.offset || 0 ;
		$('#find').val ( s ) ;
		self.setRTL() ;
		$.getJSON ( '//www.wikidata.org/w/api.php?callback=?' , {
			action : 'query' ,
			list : 'search' ,
			sroffset : offset ,
			srsearch : s ,
			srnamespace : 0 ,
			srlimit : 50 ,
			format : 'json'
		} , function ( data ) {
			var qs = [] ;
			var cnt = offset ;
			var h = "<div><table id='search_results' class='table-condensed table-striped' style='width:100%'>" ;
			h += "<tbody>" ;
			$.each ( data.query.search||[] , function ( k , v ) {
				cnt++ ;
				var q = v.title ;
				qs.push ( q ) ;
				h += "<tr><th style='"+(self.isRTL?'':'text-align:right')+"'>" + cnt + "</th>" ;
				h += "<td><a class='q_internal' q='"+q+"' id='sr_q"+q+"' href='?lang="+self.wd.main_languages[0]+"&q="+q+"'>" + q + "</a>" ;
				h += " <span style='font-size:0.6em'><a href='//wikidata.org/wiki/" + q + "' class='wikidata' target='_blank'>WD</a></span>" ;
				h += "</td>" ;
				h += "<td><div id='sr_ad"+q+"'></div><div id='sr_d"+q+"'></div></td>" ;
				h += "</tr>" ;
			} ) ;
			h += "</tbody></table></div>" ;
			
			if ( offset != 0 || data.query.searchinfo.totalhits > cnt ) {
				var x = [] ;
				var l = self.params.lang || 'en' ;
				for ( var i = 0 ; i < data.query.searchinfo.totalhits ; i += 50 ) {
					var t = (i+50>data.query.searchinfo.totalhits) ? data.query.searchinfo.totalhits : i+50 ;
					t = (i+1) + "&ndash;" + t ;
					if ( i != offset ) t = "<a href='?lang="+l+"&offset="+i+"&find="+escape(s)+"'>" + t + "</a>" ;
					else t = "<b>" + t + "</b>" ;
					x.push ( t ) ;
				}
				h += "<div>" + x.join(' | ') + "</div>" ;
			}
			
			$('#main').html ( h ) ;
			$('#main_content').show() ;
			$('#main_content_sub').show() ;
			$('#search_results td,#search_results th').css({'text-align':''}) ;
			
			self.wd.loadItems ( qs , {
				finished : function ( x ) {
					$.each ( qs , function ( dummy , q ) {
						var i = self.wd.getItem ( q ) ;
						if ( undefined === i ) return ;
						$('#sr_q'+q).text ( i.getLabel() ) ;
						$('#sr_d'+q).text ( i.getDesc(self.wd.main_languages[0]) ) ;
						//if ( i.getDesc() == '' ) 
						wd_auto_desc.loadItem ( q , { target:$('#sr_ad'+q) , reasonator_lang:(self.params.lang||'en') , links:'reasonator_local' } ) ;
					} ) ;
				}
			} , 0 ) ;
			
			self.addHoverboxes () ;
		} ) ;
	} ,
	
	showGeneawiki : function () {
		var self = this ;
		
		var lang = self.wd.main_languages[0] ;
		var id = 'geneawiki' ;
		if ( $('#'+id).is(':visible') ) {
			$('#'+id).toggle() ;
			$('#'+id+'_status').toggle() ;
		} else {
			if ( undefined === self.gw ) {

				$.getScript ( 'geneawiki2/jquery-svgpan.js' , function () {
					$.getScript ( 'geneawiki2/gw.js' , function () {
						self.gw = new GeneaWiki ( id ) ;
						self.gw.languages.unshift ( lang ) ;
						$('#'+id).show() ;
						$('#'+id+'_status').show() ;
						self.gw.status_id = id+'_status' ;
						self.gw.load ( self.q , function () {
							$('#'+id+' svg').css ( { width : '100%' } ) ;
							$('#'+id+' a').each ( function ( dummy , o ) {
								var m = $(o).attr('xlink:href').match ( /\/(Q\d+)$/ ) ;
								if ( m == null ) return ;
								$(o).attr('xlink:href','?q='+m[1]+'&lang='+lang) ;
							} )
						} ) ;
					} ) ;
				} ) ;

			} else {
				$('#'+id).toggle() ;
				$('#'+id+'_status').toggle() ;
			}
		}

		return false ;
	} ,
	
	languageDialog : function () {
		var self = this ;
		$('#').remove() ;
		var h = '' ;
		h += '<div id="languageDialog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="languageDialogLabel" aria-hidden="true">' ;
		h += '<div class="modal-header">' ;
		h += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' ;
		h += '<h3 id="languageDialogLabel">' + self.t("choose_language") + '</h3>' ;
		h += '</div>' ;
		h += '<div class="modal-body">' ;
		
		var use_quick_language_switch = false ;
		var url = "?" + ( self.q === undefined ? '' : "q="+self.q ) + ( self.params.find === undefined ? '' : "find="+escape(self.params.find) ) + "&lang=" ;
		var hadthat = {} ;

		h += "<div><h4>" + self.t("common_languages") + "</h4>" ;
		h += "<div><ul class='inline'>" ;
		$.each ( self.wd.main_languages , function ( dummy , l ) {
			if ( hadthat[l] ) return ;
			hadthat[l] = true ;
			h += "<li><div>" ;
			if ( use_quick_language_switch ) {
				h += "<a href='#' class='newlang' lang='"+l+"'>" + (self.all_languages[l]||l) + "</a>" ;
			} else {
				h += "<a href='" + url + l + "'>" + (self.all_languages[l]||l) + "</a>" ;
			}
			h += "</div></li>" ;
		} ) ;
		h += "</ul></div></div>" ;

		h += "<div><h4>"+self.t('worldwide')+"</h4>" ;
		h += "<div><ul class='inline'>" ;
		$.each ( self.all_languages , function ( l , name ) {
			if ( hadthat[l] ) return ;
			hadthat[l] = true ;
			h += "<li><div>" ;
			if ( use_quick_language_switch ) {
				h += "<a href='#' class='newlang' lang='"+l+"'>" + (self.all_languages[l]||l) + "</a>" ;
			} else {
				h += "<a href='" + url + l + "'>" + (self.all_languages[l]||l) + "</a>" ;
			}
			h += "</div></li>" ;
		} ) ;
		h += "</ul></div></div>" ;
		
		
		h += '</div>' ;
		h += '</div>' ;
		
		$('body').append ( h ) ;
		
		if ( use_quick_language_switch ) {
			$('#languageDialog a.newlang').click ( function () {
				$('#languageDialog').modal('hide') ;
				var l = $(this).attr('lang') ;
				self.wd.main_languages.unshift ( l ) ;
				self.reShow() ;
			} ) ;
		}
		
		$('#languageDialog li').css({'width':'120px'})
		$('#languageDialog li div').css({'background-color':'#FFF','margin':'1px','padding':'1px'})
		
		$('#languageDialog').modal({show:true}) ;
	} ,
	
	reShow : function () { // THIS NEEDS WORK!
		var self = this ;
		$('div.mythumb').remove() ;
		$('#all_images').html('') ;
		$('#main div.entity').hide() ;
		$('div.sidebar div').html('') ;
		$('div.map').html('') ;
		$('div.qrcode').remove() ;
		$('div.concept_cloud').remove() ;
		$('#related_media_container').remove() ;
		self.clear() ;
		var q = self.q ;
		window.location.hash = self.getCurrentUrl ( { hash:true } ) ;

		function reShowSub () {
			self.loadQ ( q ) ;
		}

		var loadcnt  = 2 ;
		self.wd.getItemBatch ( [q] , function ( d1 ) {
			self.addToLoadLater ( q ) ;
			loadcnt-- ; if ( loadcnt == 0 ) reShowSub() ;
		} ) ;
		self.getRelatedEntities ( q , function () {
			loadcnt-- ; if ( loadcnt == 0 ) reShowSub() ;
		} ) ;
	} ,
	
	
	loadRandomItem : function () {
		var self = this ;
		$.getJSON ( '//www.wikidata.org/w/api.php?callback=?' , { // Get site info (languages)
			action:'query',
			list:'random',
			rnnamespace:'0',
			format:'json'
		} , function ( d ) {
			if ( self.use_js_refresh ) {
				self.q = d.query.random[0].title ;
				self.reShow() ;
			} else {
				var l = self.wd.main_languages[0] ;
				var url = "?q=" + d.query.random[0].title ;
				if ( l != 'en' ) url += l ;
				window.location = url ;
			}
		} ) ;
	} ,

	
	initializeFromParameters : function () {
		var self = this ;
		if ( undefined !== self.params.lang ) {
			self.params.lang = self.params.lang.replace(/\#$/,'') ;
			$('input[name="lang"]').val ( self.params.lang ) ;
			var l = self.params.lang.split(',').reverse() ;
			$.each ( l , function ( k , v ) { self.wd.main_languages.unshift(v) ; } ) ;
		}
		
		
		$('#find').attr({title:self.t('find')+' [F]'}) ;
		$('#btn_search').text(self.t('find')) ;
		$('#language_select').click ( function () { reasonator.languageDialog() ; return false } ) ;
		$('#random_item').html(self.t('random_item')).attr({title:self.t('random_item')+' [X]'}).click ( function () { reasonator.loadRandomItem() ; return false } ) ;
		
		if ( self.params.q === undefined && self.params.find == undefined) {
			$('#language_select').hide() ;
		} else {
			var curlang = self.all_languages[self.wd.main_languages[0]] || 'Unknown language' ;
			$('#language_select').text ( curlang ) ;
		}

		wd_auto_desc_wd.init() ;
		wd_auto_desc.lang = self.wd.main_languages[0] ;
		if ( undefined !== self.params.q ) self.loadQ ( self.params.q.replace(/\#/g,'') ) ;
		else if ( undefined !== self.params.find ) {
			self.find ( decodeURIComponent(self.params.find).replace(/\+/g,' ') )
		} else {
			$('#main_content').show() ;
			$('#intro').show() ;
		}
	} ,

	fin : false
} ;




$(document).ready ( function () {
	$('#emergency').remove() ;
	
	if ( reasonator.force_wdq && window.location.protocol == 'https:' ) { // Force-redirect to http, to use WDQ
		window.location = window.location.href.replace(/^https:/,'http:/') ;
		return ;
	}

	$('#main_content').hide() ;
	document.title = 'Reasonator' ;
	reasonator.init ( function () {
		reasonator.initializeFromParameters() ;
	} ) ;
	
} ) ;
