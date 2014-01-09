var reasonator = {
	i18n : {
		'en' : {
			'name' : 'Name' ,
			'description' : 'Description' ,
			'instance_of' : 'Instance of' ,
			'taxonomy' : "Taxonomy" ,
			'taxon_props' : 'Taxon properties' ,
			'related_media' : 'Related media' ,
			'other_properties' : 'Other properties' ,
			'from_related_items' : 'From related items' ,
			'rank' : 'Rank' ,
			'taxonomic_name' : 'Taxonomic name' ,
			'show_items' : 'Show items' ,
			'hide_items' : 'Hide items' ,
			'location' : "Location" ,
			'admin_division' : 'Administrative division'
		} ,
		'de' : {
			'name' : 'Name' ,
			'description' : 'Beschreibung' ,
			'instance_of' : 'Instanz von' ,
			'taxonomy' : "Taxonomie" ,
			'taxon_props' : 'Taxon-Eigenschaften' ,
			'related_media' : 'Verwandte Medien' ,
			'other_properties' : 'Andere Eigenschaften' ,
			'from_related_items' : 'Von verwandten Einträgen' ,
			'rank' : 'Rang' ,
			'taxonomic_name' : 'Taxonomischer Name' ,
			'show_items' : 'Zeige Einträge' ,
			'hide_items' : 'Verstecke Einträge' ,
			'location' : "Ort" ,
			'admin_division' : 'Administrative Gliederung'
		}
	} ,
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
		IUCN : 141 ,
		range_map : 181 ,
		endemic_to : 183 ,
		parent_taxon : 171 ,
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
	
	imgcnt : 0 ,
	table_block_counter : 0 ,

	
	
	
	t : function ( k ) {
		var self = this ;
		var l = self.params.lang ;
		if ( l === undefined ) l = 'en' ; // Default
		if ( undefined === self.i18n[l] || self.i18n[l][k] === undefined) {
			return self.i18n['en'][k] ; // Fallback
//			return "<i>" + self.i18n['en'][k] + "</i><small>translate me!</small>" ;
		} else {
			return self.i18n[l][k] ;
		}
	} ,


	init : function ( callback ) {
		var self = this ;
		self.q = undefined ;
		self.wd = new WikiData ;
		self.personal_relation_list = [] ;
		self.do_maps = undefined ;
		$.each ( ['father','mother','child','brother','sister','spouse','uncle','aunt','stepfather','stepmother','grandparent'] , function ( k , v ) {
			self.personal_relation_list.push ( self.P_person[v] ) ;
		} ) ;
		$.getJSON ( '//meta.wikimedia.org/w/api.php?callback=?' , {
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
			callback() ;
		} ) ;
	} ,
	
	loadQ : function ( q ) {
		var self = this ;
		self.P = $.extend(true, {}, self.P_all);
		self.q = self.wd.convertToStringArray ( q , 'Q' ) [0] ;
		self.mm_load = [] ;
		$('#main_content').load ( 'main.html' , function () {
			$('#main_content').show() ;
			$('#top').html ( '<i>Loading...</i>' ) ;
			self.wd.loadItems ( q , {
				loaded : function ( x ) { self.q = x } ,
				finished : function ( x ) { self.detectAndLoadQ ( self.q ) }
			} , 0 ) ;
		} ) ;
	} ,
	
	detectAndLoadQ : function ( q ) {
		var self = this ;
		if ( q === undefined ) return ; // TODO error "item not found"
		if ( self.isPerson(q) ) self.loadPerson ( q ) ;
		else if ( self.isTaxon(q) ) self.loadTaxon ( q ) ;
		else if ( self.isLocation(q) ) self.loadLocation ( q ) ;
		else {
			self.loadGeneric ( q ) ;
//			$('#top').html ( "Unknown item type" ) ;
		}
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

	loadGeneric : function ( q ) {
		var self = this ;
		self.P = $.extend(true, self.P_all, self.P_websites);
		self.main_type = 'generic' ;
		self.wd.clear() ;
		
		self.wd.loadItems ( [] , {
			finished : function () {
		
			self.wd.loadItems ( q , {
				follow : [] ,
				preload : [] ,
				preload_all_for_root : true ,
				finished : function ( x ) {
					self.getRelatedEntities ( q , function () {
						self.showGeneric ( q )
					} ) ;
				}
			} , 2 ) ;
		
		} } ) ; // Brother/sister
		
	} ,
	
	loadPerson : function ( q ) {
		var self = this ;
		self.P = $.extend(true, self.P_all, self.P_person,self.P_websites);
		self.main_type = 'person' ;
		self.wd.clear() ;
		
		self.wd.loadItems ( ['P7','P9'] , { // Brother/sister
			finished : function () {
		
			self.wd.loadItems ( q , {
				follow : self.personal_relation_list ,
				preload : [ self.P.sex ] ,
				preload_all_for_root : true ,
				finished : function ( x ) {
					self.getRelatedEntities ( q , function () {
						self.showPerson ( q )
					} ) ;
				}
			} , 2 ) ;
		
		} } ) ; // Brother/sister
		
	} ,
	
	loadTaxon : function ( the_q ) {
		var self = this ;
		self.P = $.extend(true, self.P_all, self.P_taxon);
		self.main_type = 'taxon' ;
		self.wd.clear() ;

		self.wd.loadItems ( the_q , {
			follow : self.taxon_list ,
			preload : [ 105 , 405 , 141 , 183 ] ,
			preload_all : true ,
			finished : function ( p ) {
				self.showTaxon ( the_q ) ;
			}
		} ) ;

	} ,
	
	loadLocation : function ( the_q ) {
		var self = this ;
		self.P = $.extend(true, self.P_all, self.P_location);
		self.main_type = 'location' ;
		self.wd.clear() ;

		self.wd.loadItems ( the_q , {
			follow : self.location_props ,
			preload : [ 132 ] , // 105 , 405 , 141 , 183
			preload_all : true ,
			preload_all_for_root : true ,
			finished : function ( p ) {
				self.showLocation ( the_q ) ;
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
	} ,


	showPerson : function ( q ) {
		var self = this ;
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

		// Render taxon chain
		var chain = self.wd.getItem(q).followChain({props:self.taxon_list}) ;
		h = "<h2>" + self.t('taxonomy') + "</h2>" ;
		h += self.renderChain ( chain , [
			{ title:self.t('rank') , prop:105 , default:'<i>(unranked)</i>' } ,
			{ title:self.t('name') , name:true } ,
			{ title:self.t('taxonomic_name') , prop:225 , default:'&mdash;' , type:'string' , ucfirst:true } ,
		] ) ;
		
		// Render taxon properties
		var sd = {} ;
		$.each ( [105,405,141,183] , function ( dummy , p ) {
			p = 'P' + p ;
			var items = self.wd.items[q].getClaimObjectsForProperty(p) ;
			if ( items.length === 0 ) return ;
			if ( sd[p] === undefined ) sd[p] = {} ;
			$.each ( items , function ( k , v ) {
//				sd[p][v.key] = {type:'item',mode:1} ;
				sd[p][v.key] = $.extend(true,{type:'item',mode:1},v) ;
			} ) ;
		} ) ;
		self.renderPropertyTable ( sd , { id:'#taxon div.props',striped:true,title:self.t('taxon_props'),ucfirst:true } ) ;

		self.finishDisplay ( h ) ; // Finish
	} ,


	showLocation : function ( q ) {
		var self = this ;
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
		
		var chain = self.wd.getItem(q).followChain({props:self.location_props}) ;
		h = "<h2>" + self.t('location') + "</h2>" ;
		h += self.renderChain ( chain , [
			{ title:self.t('name') , name:true } ,
			{ title:self.t('description') , desc:true } ,
			{ title:self.t('admin_division') , prop:132 } ,
		] ) ;

		self.P['type_of_administrative_division'] = 132 ;
		$.each ( self.location_props , function ( k , v ) {
			self.P['P'+v] = v ; // Prevent them showing in "other" list
		} ) ;

		self.addOther() ; // Render other properties
		self.addMedia() ; // Render images
		self.finishDisplay ( h ) ; // Finish
	} ,


//__________________________________________________________________________________________
// PERSON details

	addSignature : function () {
		var self = this ;
		var im = self.wd.items[self.q].getMultimediaFilesForProperty ( self.P.signature ) ;
		if ( im.length > 0 ) {
			var io = { file:im[0] , type:'image' , id:'#person .signature' , title:im[0] , tw:250 , th:200 } ;
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
		
		// Setting relations from main item
		$.each ( rel[q] , function ( p , ql ) {
			var section ;
			if ( p == self.P.father || p == self.P.mother) section = 'parents' ;
			else if ( p == self.P.brother || p == self.P.sister ) section = 'siblings' ;
			else if ( p == self.P.child ) section = 'children' ;
			else section = 'other' ;
			if ( relations[section][p] === undefined ) relations[section][p] = {} ;
			$.each ( ql , function (k,v){ relations[section][p][v.key]=$.extend(true,{type:'item',mode:1},v) } ) ;
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
					if ( relations[section][real_p][cq] === undefined ) relations[section][real_p][cq] = val ; // Do not overwrite "1" with "2"
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
				if ( self.wd.items[v.key].gender == 'M' ) real_p = self.P.brother ;
				else if ( self.wd.items[v.key].gender == 'F' ) real_p = self.P.sister ;
				else val = {type:'item',mode:2} ;
				val.q = v.key ;
				val.key = val.q ;
				val.qualifiers = $.extend(true,{},v.qualifiers);
				if ( relations[section][real_p] === undefined ) relations[section][real_p] = {} ;
				if ( relations[section][real_p][v.key] === undefined ) relations[section][real_p][v.key] = val ; // Do not overwrite "1" with "2"
			} ) ;
		} ) ;

		// Render relatives
		$('#pr_full_tree').html ( "<a href='//toolserver.org/~magnus/ts2/geneawiki2/?q="+escattr(q)+"' target='_blank'>See the full family tree</a>" ) ;
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
		if ( country != '' ) h.push ( 'from' ) ;
		h.push ( country ) ;
		h = $.trim(h.join(' ').replace(/\s+/g,' ')) ;
		$('#person div.autodesc').html ( h ) ;
	} ,



//__________________________________________________________________________________________
// Show parts


	renderChain : function ( chain , columns ) {
		var self = this ;
		var h = '' ;
		h += "<table class='table table-condensed table-striped'><thead><tr>" ;
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
		$('#top').html ( "Item " + self.getItemLink ( { type:'item',q:self.q } , { show_q:true,desc:true,force_external:true } ) ) ;
	} ,
	
	renderName : function () {
		var self = this ;
		$('#'+self.main_type+' h1.main_title').html ( self.wd.items[self.q].getLabel() ) ;
		self.setDocTitle ( self.wd.items[self.q].getLabel() ) ;
	} ,
	
	
	showDescription : function () {
		var self = this ;
		$('#'+self.main_type+' div.manual_description').html ( self.wd.items[self.q].getDesc() ) ;
	} ,

	
	finishDisplay : function ( h ) {
		var self = this ;
		$.each ( self.mm_load , function ( k , v ) { self.multimediaLazyLoad ( v ) } ) ;
		self.mm_load = [] ;

		if ( undefined !== h ) $('#'+self.main_type+' .main').html ( h ) ;
		$('#'+self.main_type).show() ;

		if ( undefined !== self.do_maps ) {
			setTimeout ( function () {
				$.each ( self.do_maps , function ( k , v ) {
					self.setMap ( v[0] , v[1] , v[2] ) ;
				} ) ;
			} , 100 ) ;
		}
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
				sd[p][v.key] = $.extend(true,{type:'item',mode:1},v) ;
			} ) ;
		} ) ;
		
		self.renderPropertyTable ( sd , { id:'.entity_'+self.main_type+' .misc_data' , striped:true } ) ;
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
			io.tw = 200 ;
			io.th = 200 ;
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

		$.each ( ['image','video','audio','voice_recording','wikivoyage_banner','coa','seal','flag_image'] , function ( dummy1 , medium ) {
			$.each ( self.wd.items , function ( k , v ) {
				if ( v.isPlaceholder() || !v.isItem() ) return ;
				if ( v.getID() != self.q && medium != 'image' ) return ; // Don't show non-image media from other items; show those inline instead
				var im = v.getMultimediaFilesForProperty ( self.P[medium] ) ;
				$.each ( im , function ( k2 , v2 ) {
					self.imgcnt++ ;
					var medium2 = medium ;
					if ( medium == 'voice_recording' ) medium2 = 'audio' ;
					var io = { file:v2 , type:medium2 , id:'#imgid'+self.imgcnt , title:v.getLabel() } ;
					if ( self.q == v.getID() && k2 == 0 ) { // ( k2 == 0 || medium2 == 'audio' )
						io.tw = 250 ;
						io.th = 400 ;
						io.id = '#'+self.main_type+' div.main_'+medium2 ;
						io.append = true ;
						if ( medium == 'coa' || medium == 'seal' || medium == 'wikivoyage_banner' || medium == 'flag_image' ) io.type = 'image' ;
						if ( medium == 'wikivoyage_banner' ) io.tw = 640 ;
					} else {
						if ( !has_header ) {
							$('#'+self.main_type+' div.all_images').append ( "<h2>"+self.t('related_media')+"</h2><div id='related_media_meta'></div>" ) ;
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
			
			self.table_block_counter++ ;
			var block_id = 'table_block_'+ self.table_block_counter ;
			var collapse = ql.length >= self.collapse_item_list ;
			var rows = ql.length + (collapse?1:0) ;
			h += "<tr><th nowrap align='left' valign='top' rowspan='" + rows + "'>" ;
			h += self.getItemLink ( { type:'item',q:'P'+p } , { desc:true } ) ;
			h += "</th>" ;
			$.each ( ql , function ( row , cq ) {
				if ( row > 0 ) h += "<tr>" ;
				h += "<td name='" + block_id + "' style='width:100%" ;
				if ( collapse ) h += ";display:none" ;
				h += "'>" ;
/*				if ( cq.is_backlink ) {
					var s = cq.substr ( 1 ) ;
					if ( p == 373 ) h += "<a target='_blank' class='external' href='//commons.wikimedia.org/wiki/Category:"+escattr(s)+"'>" + s + "</a>" ; // Commons cat
					else h += s ;
				} else {*/
					if ( cq.mode == 2 ) h += "of&nbsp;" ;
					h += self.getItemLink ( cq , no ) ; // { internal:internal,desc:true,gender:true,q_desc:true }
//				}
				h += "</td></tr>" ;
			} ) ;
			if ( collapse ) {
				h += "<tr><td style='width:100%'>" ;
				h += ql.length + " items. " ;
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
				sd[p][ti.key] = $.extend(true,{p:p,mode:1},ti) ;
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
					sd[p][q] = o ;
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
				
				
				
				
				var h2 = "<tr><td>" + id_type + "&nbsp;</td><td>" ;
				if ( url == '' ) h2 += s ;
				else h2 += "<a target='_blank' href='" + url + "' class='external'>" + s + "</a>" ;
				h2 += "</td></tr>" ;
				h.push ( h2 ) ;
			} ) ;
		} ) ;

		if ( h.length == 0 ) return ;
		h = "<table border=0 cellpadding=1 cellspacing=0>" + h.join('') + "</table>" ;
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
				var h2 = "<div><a target='_blank' href='" + url + "' class='external'>" + self.wd.items['P'+v].getLabel() + "</a></div>" ;
				h.push ( h2 ) ;
			} ) ;
		} ) ;
		
		if ( h.length == 0 ) return ;

		$('.entity_'+self.main_type+' .websites').html ( h.join('') ) ;
	} ,
	
	addSitelinks : function () {
		var self = this ;
		var i = self.wd.items[self.q] ;
		var links = i.getWikiLinks() ;
		var hadthat = {} ;
		var h = "<table border=0 cellspacing=0 cellpadding=1>" ;
		$.each ( self.wd.main_languages , function ( dummy , l ) {
			var site = l + 'wiki' ;
			if ( undefined === links[site] || undefined !== hadthat[site] ) return ;
			hadthat[site] = true ;
			h += "<tr><td>" + l + "</td><td><a title='Open on " + l + ".wikipedia' href='//" + l + ".wikipedia.org/wiki/" + escattr(links[site].title) + "' class='wikipedia'>" + links[site].title + "</a></td></tr>" ;
		} ) ;
		h += "<tr><td colspan='2'>&nbsp;</td></tr>" ;
		$.each ( links , function ( site , dummy ) {
			if ( undefined === links[site] || undefined !== hadthat[site] ) return ;
			var l = site.replace(/wiki$/,'') ;
			hadthat[site] = true ;
			h += "<tr><td>" + l + "</td><td><a title='Open on " + l + ".wikipedia' href='//" + l + ".wikipedia.org/wiki/" + escattr(links[site].title) + "' class='wikipedia'>" + links[site].title + "</a></td></tr>" ;
		} ) ;
		h += "</table>" ;
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
		if ( internal ) h += " href='?q=" + qnum + "'" ; //h += " href='#' onclick='reasonator.loadQ(" + q.replace(/\D/g,'') + ");return false'" ; // FIXME
		else h += " class='wikidata' target='_blank' href='" + url + "'" ;
		var title = [] ;
		if ( o.desc ) { title.unshift ( item.getDesc() ) ; if ( title[0] == '' ) title.shift() }
		if ( o.q_desc ) { title.push ( q ) }
		if ( title.length > 0 ) h += " title='" + title.join('; ') + "'" ;
		h += ">" ;
		h += o.ucfirst ? ucFirst(item.getLabel()) : item.getLabel() ;
		h += "</a>" ;
		if ( internal ) {
			h += " <span style='font-size:0.6em'><a href='" + url + "' class='wikidata' target='_blank'>WD</a></span>" ;
		}
		
		if ( o.add_desc ) h += " <small>" + item.getDesc() + "</small>" ;
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
		$.getJSON ( '//commons.wikimedia.org/w/api.php?callback=?' , {
			action : 'query' ,
			titles : 'File:' + o.file ,
			prop : 'imageinfo' ,
			iiurlwidth : o.tw||120 ,
			iiurlheight : o.th||120 ,
			iiprop : 'url' ,
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
							h = "<audio controls style='max-width:"+maxw+"px'><source src='" + url + "' type='audio/ogg'><small><i>Your browser <s>sucks</s> does not support HTML5 audio.</i></small></audio>" ;
						} else if ( o.type == 'image' ) {
							h = "<img border=0 src='" + v.imageinfo[0].thumburl + "' " ;
							if ( o.title !== undefined ) h += "title='" + o.title + "' " ; 
							h += "/>" ;
							h = "<a target='_blank' href='" + v.imageinfo[0].descriptionurl + "'>" + h + "</a>" ;
						}
					} else {
						h = '' ;
					}
					$(o.id).html ( h ) ;
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
			var ql = [] ;
			$.each ( data.query.backlinks||[] , function ( k , v ) {
				var cq = 'Q' + v.title.replace(/\D/g,'') ;
				ql.push ( cq ) ;
			} ) ;

			self.wd.loadItems ( ql , { finished : function ( x ) { callback() } } , 0 ) ;
			
		} ) ;
	} ,

	
	initializeFromParameters : function () {
		var self = this ;
		self.params = getUrlVars() ;
		if ( undefined !== self.params.lang ) {
			var l = self.params.lang.split(',').reverse() ;
			$.each ( l , function ( k , v ) { self.wd.main_languages.unshift(v) ; } ) ;
		}
		if ( undefined !== self.params.q ) self.loadQ ( self.params.q ) ;
		else $('#main_content').show() ;
	} ,

	fin : false
} ;

$(document).ready ( function () {
	var img = '//upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Reasonator_logo_proposal.png/32px-Reasonator_logo_proposal.png' ;
	$('#toolname').before ( "<img border=0 src='"+img+"' />" ) ;
	$('#main_content').hide() ;
	$.getScript ( 'resources/js/map/OpenLayers.js' , function () { // 'http://www.openlayers.org/api/OpenLayers.js'
		loadMenuBarAndContent ( { toolname : 'Reasonator' , meta : 'Reasonator' , content : 'intro.html' , run : function () {
			document.title = 'Reasonator' ;
			reasonator.init ( function () {
				reasonator.initializeFromParameters() ;
			} ) ;
		} } ) ;
	} ) ;
} ) ;
