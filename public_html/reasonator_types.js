/**
 * @author Magnus Manske
 */


var reasonator_types = [] ;

/*
// Template :

// #########################################################################################################
// REASONATOR TYPE
// #########################################################################################################

reasonator_types.push ( {

	type : 'generic' ,

	detect : function () {
		var q = reasonator.q ;
	} ,

	load : function () {
		var me = this ;
		var q = reasonator.q ;
	} ,

	show : function () {
		var me = this ;
		var q = reasonator.q ;
	}
	
} ) ;
*/



// #########################################################################################################
// REASONATOR TYPE
// #########################################################################################################

reasonator_types.push ( {

	type : 'person' ,

	detect : function () {
		var q = reasonator.q ;
		if ( reasonator.wd.items[q].hasClaimItemLink ( reasonator.P.entity_type , reasonator.Q.person ) ) return true ;
		if ( reasonator.wd.items[q].hasClaimItemLink ( reasonator.P.instance_of , reasonator.Q.person ) ) return true ;
		if ( reasonator.wd.items[q].hasClaimItemLink ( reasonator.P.instance_of , reasonator.Q.human ) ) return true ;
		return false ;
	} ,

	load : function () {
		var me = this ;
		var q = reasonator.q ;
		reasonator.P = $.extend(true, reasonator.P, reasonator.P_all, reasonator.P_person,reasonator.P_websites);
		$.each ( reasonator.P_person , function ( k , v ) { reasonator.to_load.push("P"+v) } ) ;
		reasonator.loadRest ( function () {
			reasonator.to_load = [] ;
			reasonator.addPropTargetsToLoad ( reasonator.keys2array ( reasonator.wd.items ) , reasonator.P_person ) ;
			reasonator.loadRest ( function () {
				me.show() ;
			} ) ;
		} ) ;
	} ,

	show : function () {
		var me = this ;
		var q = reasonator.q ;
		$.each ( [ 'relatives','parents','siblings','children','other' ] , function ( k , v ) {
			$('#person_'+v).html ( reasonator.t('person_'+v) ) ;
		} ) ;
		
		me.showPersonMain ( q ) ;
		reasonator.setTopLink () ;
		reasonator.renderName () ; // Render name
		reasonator.showAliases ( q ) ; // Render aliases
		reasonator.showDescription () ; // Render manual description
		me.showAutoDescPerson () ; // Render automatic description
		reasonator.showExternalIDs() ; // Render external ID links
		reasonator.showWebsites() ; // Render websites
		reasonator.addSitelinks() ; // Render sitelinks
		reasonator.addBacklinks() ; // Render backlinks
//		reasonator.addMiscData(reasonator.P_location) ; // Render misc data
		reasonator.addOther() ; // Render other properties
		reasonator.addMedia() ; // Render images
		me.addSignature() ; // Render signature
		reasonator.finishDisplay () ; // Finish
	} ,
	
	

	addSignature : function () {
		var im = reasonator.wd.items[reasonator.q].getMultimediaFilesForProperty ( reasonator.P.signature ) ;
		if ( im.length > 0 ) {
			var io = { file:im[0] , type:'image' , id:'div.signature' , title:im[0] , tw:260 , th:220 } ;
			reasonator.mm_load.push ( io ) ;
		}
	} ,


	showPersonMain : function ( q ) {
		var rel = {} ;
		rel[q] = {} ;
		$.each ( reasonator.wd.items , function ( dummy , item ) {
			var cq = item.getID() ;
			if ( item.hasClaimItemLink ( reasonator.P.sex , reasonator.Q.male ) ) item.gender = 'M' ;
			else if ( item.hasClaimItemLink ( reasonator.P.sex , reasonator.Q.female ) ) item.gender = 'F' ;
			else if ( item.hasClaimItemLink ( reasonator.P.entity_type , reasonator.Q.person ) ) item.gender = '?' ;
			
			$.each ( reasonator.personal_relation_list , function ( dummy2 , p ) {
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
			if ( p == reasonator.P.father || p == reasonator.P.mother) section = 'parents' ;
			else if ( p == reasonator.P.brother || p == reasonator.P.sister ) section = 'siblings' ;
			else if ( p == reasonator.P.child ) section = 'children' ;
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
					if ( p == reasonator.P.father || p == reasonator.P.mother) {
						section = 'children' ;
						real_p = reasonator.P.child ;
					} else if ( p == reasonator.P.brother || p == reasonator.P.sister ) {
						section = 'siblings' ;
						if ( reasonator.wd.items[cq].gender == 'M' ) real_p = reasonator.P.brother ;
						else if ( reasonator.wd.items[cq].gender == 'F' ) real_p = reasonator.P.sister ;
						else val = {type:'item',mode:2} ;
					} else if ( p == reasonator.P.child ) {
						section = 'parents' ;
						if ( reasonator.wd.items[cq].gender == 'M' ) real_p = reasonator.P.father ;
						else if ( reasonator.wd.items[cq].gender == 'F' ) real_p = reasonator.P.mother ;
						else val = {type:'item',mode:2} ;
					} else {
						section = 'other' ;
						if ( p != reasonator.P.spouse ) val = {type:'item',mode:2} ;
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
			if ( undefined === rel[par][reasonator.P.child] ) return ;
			$.each ( rel[par][reasonator.P.child] , function ( k , v ) {
				if ( v.type != 'item' ) return ;
				if ( v.key == q ) return ; // Refers to main item, had that
				var section = 'siblings' ;
				var real_p ;
				var val = {type:'item',mode:1} ;
				if ( reasonator.wd.items[v.key] === undefined ) val = {type:'item',mode:2} ;
				else if ( reasonator.wd.items[v.key].gender == 'M' ) real_p = reasonator.P.brother ;
				else if ( reasonator.wd.items[v.key].gender == 'F' ) real_p = reasonator.P.sister ;
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
		$('div.personal_relations').show() ;

		// Render relatives
		var geneawiki_url = "geneawiki2/?q="+escattr(q) ;
		$('#pr_full_tree').html ( reasonator.t('family_tree') + ": <a class='internal' href='#'>"+reasonator.t('inline')+"</a>/<a target='_blank' href='"+geneawiki_url+"' class='external'>"+reasonator.t('new_page')+"</a>" ) ;
		$('#pr_full_tree a.internal').click ( function () { reasonator.showGeneawiki(); return false } ) ;
		
		$.each ( relations['children'] , function ( p , v ) {
			$.each ( v , function ( cq , v2 ) {
				reasonator.timeline_candidates['Q'+(cq+'').replace(/\D/g,'')] = [ 'P569' ] ;
			} ) ;
		} ) ;
		
		$.each ( relations , function ( section , sd ) {
			reasonator.renderPropertyTable ( sd , { id:'#pr_'+section,internal:true } ) ;
		} ) ;
	} ,
	

	showAutoDescPerson : function () {
		var q = reasonator.q ;
		var h = [] ;
		h.push ( reasonator.getItemLinks ( q , { p:reasonator.P.sex,q_desc:true,desc:true } ) . join ( ' ' ) ) ;
		h.push ( reasonator.getItemLinks ( q , { p:reasonator.P.occupation,q_desc:true,desc:true } ) . join ( '/' ) ) ;
		var country = reasonator.getItemLinks ( q , { p:reasonator.P.nationality,q_desc:true,desc:true } ) . join ( ' ' ) ;
		if ( country != '' ) h.push ( reasonator.t('from') ) ;
		h.push ( country ) ;
		h = $.trim(h.join(' ').replace(/\s+/g,' ')) ;
		$('div.autodesc').html ( h ) ;
	}
	
} ) ;



// #########################################################################################################
// REASONATOR TYPE
// #########################################################################################################

reasonator_types.push ( {

	type : 'taxon' ,

	detect : function () {
		var q = reasonator.q ;
		var ret = false ;
		var props = reasonator.wd.items[q].getPropertyList() ;
		var list = $.extend ( [] , reasonator.taxon_list , [225,105] ) ;
		$.each ( list , function ( k , v ) {
			if ( -1 == $.inArray ( 'P'+v , props ) ) return ;
			ret = true ;
			return false ;
		} ) ;
		return ret ;
	} ,

	load : function () {
		var me = this ;
		var q = reasonator.q ;
		reasonator.P = $.extend(true, reasonator.P, reasonator.P_all, reasonator.P_taxon);

		reasonator.loadBacktrack ( {
			follow : reasonator.taxon_list ,
			preload : [ 105 , 405 , 141 , 183 , 910 ] ,
			wdq : 'tree['+(q+'').replace(/\D/g,'')+']['+reasonator.taxon_list.join(',')+']' ,
			callback : function () {
				reasonator.loadRest ( function () { me.show() } ) ;
			}
		} ) ;
	} ,

	show : function () {
		var me = this ;
		var q = reasonator.q ;
		var h = '' ;
		reasonator.setTopLink () ;
		reasonator.renderName () ; // Render name
		reasonator.showAliases ( q ) ; // Render aliases
		reasonator.showDescription () ; // Render manual description
//		reasonator.showMaps() ; // Render maps
		reasonator.showExternalIDs() ; // Render external ID links
//		reasonator.showWebsites() ; // Render websites
		reasonator.addSitelinks() ; // Render sitelinks
		reasonator.addBacklinks() ; // Render backlinks
//		reasonator.addMiscData(reasonator.P_location) ; // Render misc data
		reasonator.addOther() ; // Render other properties
		reasonator.addMedia() ; // Render images

    
		// Render taxon chain
		var chain = reasonator.findLongestPath ( { start:q , props:reasonator.taxon_list } ) ;
		h = "<h2>" + reasonator.t('taxonomy') + "</h2>" ;
		h += reasonator.renderChain ( chain , [
			{ title:reasonator.t('rank') , prop:105 , default:'<i>(unranked)</i>' } ,
			{ title:reasonator.t('name') , name:true } ,
			{ title:reasonator.t('taxonomic_name') , prop:225 , default:'&mdash;' , type:'string' , ucfirst:true } ,
		] ) ;

		if ( reasonator.use_wdq ) {
			h += reasonator.getWDQnotice() ;
		}
		
		// Render taxon properties
		var taxon_props = [225,105,405,141,183,427,566] ;
		reasonator.renderMainPropsTable ( taxon_props ) ;
		
		// Label in italics, if same as taxon name
		var label = reasonator.wd.items[reasonator.q].getLabel() ;
		$.each ( reasonator.wd.items[reasonator.q].getStringsForProperty('P225') , function ( k , v ) {
			if ( v != label ) return ;
			$('#main_title_label').css({'font-style':'italic'}) ;
			return false ;
		} ) ;

		reasonator.finishDisplay ( h ) ; // Finish
		
		me.suggestGenus ( q ) ;
	} ,

	
	suggestGenus : function ( q ) {
		var parent_taxon_props = [171,71,70,77,76,75,273] ; // TODO incomplete?
		var i = reasonator.wd.items[q] ;
		var parent_taxa = 0 ;
		$.each ( parent_taxon_props , function ( k , v ) {
			parent_taxa += i.getClaimItemsForProperty('P'+v).length ;
		} ) ;
		if ( parent_taxa > 0 ) return ; // Already has taxonomy
		
		var m = $('#main_title_label').text().match ( /^(\S+)\s(\S+)$/ ) ;
		if ( m == null ) return ; // Not "Genus species" title
		var putative_genus = m[1] ;

		$.getJSON ( '//www.wikidata.org/w/api.php?callback=?' , {
			action:'query',
			list:'search',
			format:'json',
			srsearch:putative_genus,
			srnamespace:0,
			srprop:'',
			srlimit:10
		} , function ( d ) {
			if ( undefined === d.query || undefined === d.query.search ) return ;
			var candidates = [] ;
			$.each ( d.query.search , function ( k , v ) {
				if ( v.title == reasonator.q ) return ; // Not add reasonator
				candidates.push ( v.title ) ;
			} ) ;
			if ( candidates.length == 0 ) return ; // No candidates

			reasonator.wd.getItemBatch ( candidates , function () {
				var h = "<hr/><div id='taxonguess'>" ;
				h += "<h3>"+reasonator.t('taxon_suggestion_header')+"</h3>" ;
				h += "<div style='margin-bottom:10px'>"+reasonator.t('non_content_widar_text').replace(/\$1/,"<a href='/widar' target='_blank'>")+"</div>" ;
				
				h += '<div class="panel panel-default"><div class="panel-heading">Candidate parent taxa</div>' ;

				var has_candidate = false ;
				h += "<table class='table-condensed table-striped'><tbody>" ;
				var taxonguess = {} ;
				$.each ( candidates , function ( dummy , q ) {
					var item = reasonator.wd.items[q] ;
					if ( item.hasClaimItemLink('P105','Q7432') ) return ; // Species; not a parent taxon
					if ( item === undefined ) return ; // Paranoia
					has_candidate = true ;
					var id = 'taxonguess_'+q ;
					taxonguess[q] = id ;
					h += "<tr>" ;
					h += "<th>" + reasonator.getQlink(q) + "</th>" ;
					h += "<td><div id='"+id+"'>...</div></td>" ;
//					h += "<td>" + item.getDesc() + "</td>" ;
					h += "<td><a href='#' onclick='reasonator.addClaimItemOauth(\""+reasonator.q+"\",\"P171\",\""+q+"\",{live:true});return false'>Set this as parent taxon</a></td>" ;
					h += "</tr>" ;
				} ) ;
				h += "</tbody></table></div></div>" ;
				if ( !has_candidate ) return ;
				$('#actual_content div.main').append ( h ) ;
				reasonator.addHoverboxes ( '#taxonguess' ) ;
				$.each ( taxonguess , function ( q , id ) {
					wd_auto_desc.loadItem ( q , { target:$('#'+id) , reasonator_lang:(reasonator.params.lang||'en') , links:'reasonator_local' } ) ;
				} ) ;
			} ) ;
			
		} ) ;
	}
	
} ) ;



// #########################################################################################################
// REASONATOR TYPE
// #########################################################################################################

reasonator_types.push ( {

	type : 'location' ,

	detect : function () {
		var q = reasonator.q ;
		if ( reasonator.wd.items[q] !== undefined && reasonator.wd.items[q].raw !== undefined && reasonator.wd.items[q].raw.claims !== undefined && reasonator.wd.items[q].raw.claims['P625'] !== undefined ) return true ;
		if ( reasonator.wd.items[q] !== undefined && reasonator.wd.items[q].raw !== undefined && reasonator.wd.items[q].raw.claims !== undefined && reasonator.wd.items[q].raw.claims['P131'] !== undefined ) return true ;
		if ( reasonator.wd.items[q].hasClaimItemLink ( reasonator.P.entity_type , reasonator.Q.geographical_feature ) ) return true ;
		var ret = false ;
		$.each ( reasonator.location_list , function ( k , v ) {
			if ( reasonator.wd.items[q].hasClaimItemLink ( reasonator.P.instance_of , v ) ) {
				ret = true ;
				return false ;
			}

		} ) ;
		return ret ;
	} ,

	load : function () {
		var me = this ;
		var q = reasonator.q ;
		reasonator.P = $.extend(true, reasonator.P, reasonator.P_all, reasonator.P_location, reasonator.P_websites);
		$.getScript ( 'resources/js/map/OpenLayers.js' , function () { reasonator.openlayers_loaded = true ;} ) ; // 'http://www.openlayers.org/api/OpenLayers.js'
		
		reasonator.loadBacktrack ( {
			follow : reasonator.location_props ,
			preload : [ 131,132 ] ,
			wdq : 'tree['+(q+'').replace(/\D/g,'')+']['+reasonator.location_props.join(',')+']' ,
			callback : function () {
				me.show();
			}
		} ) ;
	} ,

	show : function () {
		var me = this ;
		var q = reasonator.q ;
		if ( !reasonator.openlayers_loaded ) { // Race condition
			setTimeout ( function(){me.show()} , 50 ) ;
			return ;
		}

		// RENDERING
		var h = '' ;
		reasonator.setTopLink () ;
		reasonator.renderName () ; // Render name
		reasonator.showAliases ( q ) ; // Render aliases
		reasonator.showDescription () ; // Render manual description
		reasonator.showMaps() ; // Render maps
		reasonator.showExternalIDs() ; // Render external ID links
		reasonator.showWebsites() ; // Render websites
		reasonator.addSitelinks() ; // Render sitelinks
		reasonator.addBacklinks() ; // Render backlinks
		reasonator.addMiscData(reasonator.P_location) ; // Render misc data
		
//		var chain = reasonator.wd.getItem(q).followChain({props:reasonator.location_props}) ;
		var chain = reasonator.findLongestPath ( { start:q , props:reasonator.location_props } ) ;
		h = "<h2>" + reasonator.t('location') + "</h2>" ;
		h += reasonator.renderChain ( chain , [
			{ title:reasonator.t('name') , name:true } ,
			{ title:reasonator.t('description') , desc:true } ,
			{ title:reasonator.t('admin_division') , prop:132 } ,
		] ) ;

		if ( reasonator.use_wdq ) {
			var url = reasonator.getCurrentUrl ( { live:true } ) ;
			var line = reasonator.t('wdq_notice') ;
			line = line.replace(/\$1/,"<a class='external' style='font-size:8pt' target='_blank' href='http://wikidata-wdq-mm.instance-proxy.wmflabs.org/'>" ) ;
			line = line.replace(/\$2/,"<a href='" + url + "'>" ) ;
			h += "<div style='color:#DDDDDD;font-size:8pt'>" + line + "</div>" ;
		}

		reasonator.P['type_of_administrative_division'] = 132 ;
		$.each ( reasonator.location_props , function ( k , v ) {
			reasonator.P['P'+v] = v ; // Prevent them showing in "other" list
		} ) ;

		if ( reasonator.wd.items[reasonator.q].hasClaims('P625') ) $('div.maps').show() ;
		reasonator.addOther() ; // Render other properties
		reasonator.addMedia() ; // Render images
		reasonator.renderMainPropsTable ( [31,421] ) ;
		reasonator.finishDisplay ( h ) ; // Finish
	}
	
} ) ;


// #########################################################################################################
// REASONATOR TYPE
// #########################################################################################################

reasonator_types.push ( {

	type : 'generic' ,

	detect : function () { return true ; } , // Fallback

	load : function () {
		var me = this ;
		var q = reasonator.q ;
		reasonator.P = $.extend(true, reasonator.P, reasonator.P_all, reasonator.P_websites);

		if ( reasonator.wd.items[q].hasClaims('P279') ) {
			reasonator.loadBacktrack ( {
				follow : [279] ,
				wdq : 'tree['+(reasonator.q+'').replace(/\D/g,'')+'][279]' ,
				callback : function () {me.show() }
			} ) ;
		} else {
			reasonator.loadRest ( function () { me.show() } ) ;
		}
	} ,
	
	show : function () {
		var me = this ;
		var q = reasonator.q ;
		delete reasonator.P.instance_of ; // So it will show, if set
		reasonator.setTopLink () ;
		reasonator.renderName () ; // Render name
		reasonator.showAliases ( q ) ; // Render aliases
		reasonator.showDescription () ; // Render manual description
		reasonator.showExternalIDs() ; // Render external ID links
		reasonator.showWebsites() ; // Render websites
		reasonator.addSitelinks() ; // Render sitelinks
		reasonator.addBacklinks() ; // Render backlinks
//		reasonator.addMiscData(reasonator.P_location) ; // Render misc data
		reasonator.addOther() ; // Render other properties
		reasonator.addMedia() ; // Render images

		reasonator.renderSubclassChain() ;

		reasonator.finishDisplay () ; // Finish
		$('div.other h2').remove() ;
		
		if ( undefined !== reasonator.wd.items[q].raw.claims ) return ;
		if ( ! /:/.test ( $('#main_title_label').text() ) ) return ;
		
		var non_content_types = [ reasonator.Q.category_page , reasonator.Q.template_page , reasonator.Q.list_page , reasonator.Q.disambiguation_page ] ;
		reasonator.wd.getItemBatch ( non_content_types , function () {
			var h = "<div>" ;
			h += "<h3>"+reasonator.t('non_content_widar_header')+"</h3>" ;
			h += "<div style='margin-bottom:10px'>"+reasonator.t('non_content_widar_text').replace(/\$1/,"<a href='/widar' target='_blank'>")+"</div>" ;
			h += "<ul>" ;
			$.each ( non_content_types , function ( k , v ) {
				h += "<li>" ;
				h += "<a href='#' onclick='reasonator.addClaimItemOauth(\""+reasonator.q+"\",\"P31\",\"Q"+v+"\");return false'>" + reasonator.wd.items['Q'+v].getLabel() + "</a>" ;
				h += "</li>" ;
			} ) ;
			h += "</ul>" ;
			h += "</div>" ;
			$('#actual_content div.other').html(h) ;
		} ) ;
		
	} ,


} ) ;
