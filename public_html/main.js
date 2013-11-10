var reasonator = {
	collapse_item_list : 20 ,
	P_all : {
		entity_type : 107 ,
		instance_of : 31 ,
		audio : 51 ,
		voice_recording : 990 ,
		video : 10 ,
		maic : 301 , // Main article in category
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
	E : {
		215627 : 'person'
	} ,
	Q : {
		human : 5 ,
		male : 6581097 ,
		female : 6581072 ,
		person : 215627
	} ,
	extURLs : {} ,
	imgcnt : 0 ,

	init : function ( callback ) {
		var self = this ;
		self.q = undefined ;
		self.wd = new WikiData ;
		self.personal_relation_list = [] ;
		$.each ( ['father','mother','child','brother','sister','spouse','uncle','aunt','stepfather','stepmother','grandparent'] , function ( k , v ) {
			self.personal_relation_list.push ( self.P_person[v] ) ;
		} ) ;
		self.taxon_list = [ 171 , 273 , 75 , 76 , 77 , 70 , 71 , 74 , 89 ] ;
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
				self.P_person[id] = prop * 1 ;
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
		else {
			$('#top').html ( "Unknown item type" ) ;
		}
	} ,
	
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

	showTaxon : function ( q ) {
		var self = this ;
		$('#top').html ( "Item " + self.getItemLink ( { type:'item',q:q } , { show_q:true,desc:true,force_external:true } ) ) ;
		
		
		// RENDERING
		var h = '' ;

		// Render name
		$('#taxon h1.main_title').html ( self.wd.items[q].getLabel() ) ;
		self.setDocTitle ( self.wd.items[q].getLabel() ) ;
		
		// Render aliases
		h = [] ;
		$.each ( self.wd.items[q].getAliases() , function ( k , v ) {
			h.push ( "<div class='alias'>" + v.replace(/\s/g,'&nbsp;') + "</div>" ) ;
		} ) ;
		h = h.join ( ' | ' ) ;
		$('#taxon div.aliases').html ( h ) ;
		
		// Render manual description
		$('#taxon div.manual_description').html ( self.wd.items[q].getDesc() ) ;
		
		// Render external ID links
		self.showExternalIDs() ;
		
		// Render sitelinks
		self.addSitelinks() ;
		
		// Render backlinks
		self.addBacklinks() ;
		
		// Render other properties
		self.addOther() ;

		// Render images
		self.addMedia() ;

		
		// Render taxon chain
		var chain = self.wd.getItem(q).followChain({props:self.taxon_list}) ;
		h = "<h2>Taxonomy</h2>" ;
		h += "<table class='table table-condensed table-striped'><thead><tr><th>Rank</th><th>Name</th><th>Taxonomic name</th></tr></thead><tbody>" ;
		while ( chain.length > 0 ) {
			var q = chain.pop() ;
			var rank = self.wd.items[q].getClaimsForProperty('P105') ;
			var rankname = '<i>(unranked)</i>' ;
			if ( rank.length > 0 ) {
				rank = self.wd.items[q].getClaimTargetItemID(rank[0]) ;
				if ( undefined !== self.wd.items[rank] ) rankname = self.getItemLink ( { type:'item',q:rank } , {ucfirst:true,desc:true,q_desc:true} ) ;
			}
			var taxonames = self.wd.items[q].getClaimsForProperty('P225') ;
			var taxoname = '&mdash;' ;
			if ( taxonames.length > 0 ) taxoname = self.wd.items[q].getClaimTargetString(taxonames[0]) || taxoname ;
			h += "<tr>" ;
			h += "<th align='left' nowrap>" + rankname + "</th>" ;
			h += "<td nowrap>" + self.getItemLink ( { type:'item',q:q } , {ucfirst:true,desc:true,q_desc:true,internal:true} )  + "</td>" ; // self.wd.items[q].getLink({target:'_blank',ucfirst:true,desc:true})
			h += "<td style='width:100%'>" + ucFirst(taxoname) + "</td>" ;
			h += "</tr>" ;
		}
		h += "</tbody></table>" ;
		
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
		
		self.renderPropertyTable ( sd , { id:'#taxon div.props',striped:true,title:'Taxon properties',ucfirst:true } ) ;

		$.each ( self.mm_load , function ( k , v ) { self.multimediaLazyLoad ( v ) } ) ;
		self.mm_load = [] ;
		
		$('#taxon .main').html ( h ) ;
		$('#taxon').show() ;
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
	
	showPerson : function ( q ) {
		var self = this ;
		$('#top').html ( "Item " + self.getItemLink ( { type:'item',q:q } , { show_q:true,desc:true,force_external:true } ) ) ;

		
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

		
		// RENDERING
		var h = '' ;

		// Render name
		$('#person h1.main_title').html ( self.wd.items[q].getLabel() ) ;
		self.setDocTitle ( self.wd.items[q].getLabel() ) ;
		
		// Render aliases
		h = [] ;
		$.each ( self.wd.items[q].getAliases() , function ( k , v ) {
			h.push ( "<div class='alias'>" + v.replace(/\s/g,'&nbsp;') + "</div>" ) ;
		} ) ;
		h = h.join ( ' | ' ) ;
		$('#person div.aliases').html ( h ) ;
		
		// Render manual description
		$('#person div.manual_description').html ( self.wd.items[q].getDesc() ) ;
		
		// Render automatic description
		h = [] ;
		h.push ( self.getItemLinks ( q , { p:self.P.sex,q_desc:true,desc:true } ) . join ( ' ' ) ) ;
		h.push ( self.getItemLinks ( q , { p:self.P.occupation,q_desc:true,desc:true } ) . join ( '/' ) ) ;
		var country = self.getItemLinks ( q , { p:self.P.nationality,q_desc:true,desc:true } ) . join ( ' ' ) ;
		if ( country != '' ) h.push ( 'from' ) ;
		h.push ( country ) ;
		h = $.trim(h.join(' ').replace(/\s+/g,' ')) ;
		$('#person div.autodesc').html ( h ) ;

		// Render relatives
		$('#pr_full_tree').html ( "<a href='//toolserver.org/~magnus/ts2/geneawiki2/?q="+escattr(q)+"' target='_blank'>See the full family tree</a>" ) ;
		$.each ( relations , function ( section , sd ) {
			self.renderPropertyTable ( sd , { id:'#pr_'+section,internal:true } ) ;
		} ) ;
		
		// Render external ID links
		self.showExternalIDs() ;
		
		// Render websites
		self.showWebsites() ;

		// Render sitelinks
		self.addSitelinks() ;
		
		// Render backlinks
		self.addBacklinks() ;
		
		// Render other properties
		self.addOther() ;
		
		// Render images
		self.addMedia() ;
		
		// Render signature
		var im = self.wd.items[self.q].getMultimediaFilesForProperty ( self.P.signature ) ;
		if ( im.length > 0 ) {
			var io = { file:im[0] , type:'image' , id:'#person .signature' , title:im[0] , tw:250 , th:200 } ;
			self.mm_load.push ( io ) ;
		}
		
		
		$.each ( self.mm_load , function ( k , v ) { self.multimediaLazyLoad ( v ) } ) ;
		self.mm_load = [] ;
		
		$('#person').show() ;
	} ,

	setDocTitle : function ( s ) {
		document.title = s + ' - Reasonator' ;
	} ,
	
	addMedia : function () {
		var self = this ;
		var has_header = false ;
		$.each ( ['image','video','audio','voice_recording'] , function ( dummy1 , medium ) {
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
					} else {
						if ( !has_header ) {
							$('#'+self.main_type+' div.all_images').append ( "<h2>Related media</h2>" ) ;
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
				h += "<a href='#' name='"+block_id+"' onclick='reasonator.toggleItems(\"" + block_id + "\");return false'>Show items</a>" ;
				h += "<a href='#' name='"+block_id+"' style='display:none' onclick='reasonator.toggleItems(\"" + block_id + "\");return false'>Hide items</a>" ;
				h += "</td></tr>" ;
			}
		} ) ;
		if ( h != '' ) {
			var h2 = "<table" ;
			if ( o.striped ) h2 += " class='table table-striped'" ;
			else h2 += " class='table-condensed'" ;
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
		self.renderPropertyTable ( sd , { id:'.entity_'+self.main_type+' .other' , title:'Other properties' , striped:true , add_desc:true , audio:true , video:true } ) ;

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
		self.renderPropertyTable ( sd , { id:'.entity_'+self.main_type+' .backlinks' , title:'From related items' , striped:true , add_desc:true , audio:true , video:true } ) ;
	} ,

	showExternalIDs : function () {
		var self = this ;
		var h = [] ;
		var i = self.wd.items[self.q] ;
		$.each ( self.extURLs , function ( k , v ) {
			var p = self.P[k] ;
			if ( p === undefined ) return ;

			var claims = i.getClaimsForProperty ( p ) ;
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
			if ( self.isPerson(q) || self.isTaxon(q) ) internal = true ;
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
			
/*			console.log ( dp ) ;
			var d = new Date ( dp[0]*pre , dp[1]==0?0:dp[1] , dp[2] , dp[3] , dp[4] , dp[5] ) ;
			if ( i.precision <= 9 ) ret += d.getFullYear() ;
			else if ( i.precision == 10 ) ret += d.getFullYear() + '-' + self.pad(d.getMonth(),2) ;
			else if ( i.precision == 11 ) ret += d.getFullYear() + '-' + self.pad(d.getMonth(),2) + '-' + self.pad(d.getDay(),2) ;
			else ret += d.toLocaleString();
*/

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
	$('#main_content').hide() ;
	loadMenuBarAndContent ( { toolname : 'Reasonator' , meta : 'Reasonator' , content : 'intro.html' , run : function () {
		reasonator.init ( function () {
			reasonator.initializeFromParameters() ;
		} ) ;
	} } ) ;
} ) ;
