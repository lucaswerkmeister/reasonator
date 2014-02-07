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
		me.showAutoDesc () ; // Render automatic description
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
		var me = this ;
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

		me.relations = relations ; // For later
		
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
	

	showAutoDesc : function () {
		var me = this ;
		var q = reasonator.q ;
		var wd = reasonator.wd ;
		var lang = reasonator.getMainLang() ;
		
		var show_people_dates = false ;
		
		if ( reasonator.use_long_autodesc && lang == 'en' ) {
		
			var i = wd.items[q] ;
			var h = [] ;
			
			var is_dead = i.hasClaims ( 'P570' ) ;
			var is_male = !i.hasClaimItemLink('P21','Q6581072') ;
			var s_he = (is_male?'He':'She') ;
			var his_er = (is_male?'His':'Her') ;
			
			function renderDate ( claim , o ) {
				if ( o === undefined ) o = {} ;
				var ret = { after:' ' } ;
				var d = (claim.time===undefined) ? (claim.datavalue===undefined?i.getClaimDate(claim):claim.datavalue.value) : claim ;
				var month_label = [ '' , 'January','February','March','April','May','June','July','August','September','October','November','December' ] ;

				var pre = d.time.substr(0,1) == '+' ? 1 : -1 ;
				var dp = d.time.substr(1).split(/[-T:Z]/) ;

				var year = dp[0]*1 ;
				var month = reasonator.pad ( dp[1] , 2 ) ;
				var day = reasonator.pad ( dp[2] , 2 ) ;
				
				if ( o.just_year ) return { label:year } ;
			
				var iso = d.time ; // Fallback
				var label = d.time ; // Fallback
				if ( d.precision <= 9 ) {
					iso = year*pre ;
					ret.label = year ;
					if ( !o.no_prefix ) ret.before = 'in ' ;
				} else if ( d.precision == 10 ) {
					iso = year*pre + '-' + month ;
					ret.label = month_label[month*1] + ' ' + year ;
					if ( !o.no_prefix ) ret.before = 'in ' ;
				} else if ( d.precision == 11 ) {
					iso = year*pre + '-' + month + '-' + day ;
					ret.label = month_label[month*1] + ' ' + (day*1) + ', ' + year ;
					if ( !o.no_prefix ) ret.before = 'on ' ;
				}
				if ( pre == -1 ) ret.after = " <small>B.C.E.</small>" + ret.after ;
				
				ret.url = reasonator.getSelfURL ( { date:iso } ) ;

				return ret ;
			}
			
			function getParent ( p ) {
				if ( me.relations === undefined ) return ;
				if ( me.relations.parents === undefined ) return ;
				if ( me.relations.parents[p] === undefined ) return ;
				var ret ;
				$.each ( me.relations.parents[p] , function ( k , v ) { ret = k ; return false } ) ;
				return ret ;
			}
			
			function addPerson ( pq , after ) {
				h.push ( { q:pq } ) ;
				
				var born = wd.items[pq].raw.claims['P569'] ;
				var died = wd.items[pq].raw.claims['P570'] ;

				if ( show_people_dates && ( born !== undefined || died !== undefined ) ) {
					h.push ( { label:' (' } ) ;
					if ( born !== undefined ) h.push ( renderDate ( born[0] , {just_year:true} ) ) ;
					if ( born !== undefined && died !== undefined ) h.push ( { label:'&ndash;' } ) ;
					if ( died !== undefined ) h.push ( renderDate ( died[0] , {just_year:true} ) ) ;
					h.push ( { label:')' } ) ;
				}
				
				if ( after !== undefined && after != '' ) h.push ( { label:after } ) ;
			}
			
			function addPlace ( o ) {
				if ( o.before !== undefined ) h.push ( { label:o.before } ) ;
				h.push ( { q:o.q } ) ; // TODO country, city etc.
				if ( o.after !== undefined ) h.push ( { label:o.after } ) ;
			}
			
			function getSepAfter ( arr , pos ) {
				if ( pos+1 == arr.length ) return ' ' ;
				if ( pos == 0 && arr.length == 2 ) return ' and ' ;
				if ( arr.length == pos+2 ) return ', and ' ;
				return ', ' ;
			}
			
			function getQualifierItem ( qualifiers , prop ) {
				if ( qualifiers[prop] === undefined ) return ;
				if ( qualifiers[prop][0].datavalue === undefined ) return ;
				if ( qualifiers[prop][0].datavalue.value === undefined ) return ;
				return 'Q' + qualifiers[prop][0].datavalue.value['numeric-id'] ;
			}

			function getDatesFromQualifier ( qualifiers ) {
				var ret = {} ;
				if ( qualifiers === undefined ) return ret ;
				if ( qualifiers['P581'] !== undefined ) {
					ret.from = qualifiers['P581'][0] ;
					ret.to = qualifiers['P581'][0] ;
					ret.pit = true ; // Point In Time
				} else {
					if ( qualifiers['P580'] !== undefined ) ret.from = qualifiers['P580'][0] ;
					if ( qualifiers['P582'] !== undefined ) ret.to = qualifiers['P582'][0] ;
				}
				return ret ;
			}

			function sortByDate ( x ) {
				return x.sort ( function ( a , b ) {
					if ( a.dates.from !== undefined && b.dates.from !== undefined ) {
						return a.dates.from.time == b.dates.from.time ? 0 : ( a.dates.from.time < b.dates.from.time ? -1 : 1 ) ;
					} else if ( a.dates.to !== undefined && b.dates.to !== undefined ) {
						return a.dates.to.time == b.dates.to.time ? 0 : ( a.dates.to.time < b.dates.to.time ? -1 : 1 ) ;
					}
					return a.q == b.q ? 0 : ( a.q < b.q ? -1 : 1 ) ;
				} ) ;
			}


			// qualifiers need to be item links
			function getRelatedItemsWithQualifiers ( o ) {
				if ( o === undefined ) o = {} ;

				var ret = [] ;
				$.each ( (o.properties||[]) , function ( dummy , prop ) {
					$.each ( (i.raw.claims[prop]||[]) , function ( k , claim ) {
						var eq = i.getClaimTargetItemID(claim) ;
						if ( undefined === eq ) return ;
						var em = { q:eq } ;
						if ( o.dates ) em.dates = getDatesFromQualifier(claim.qualifiers) ;
						$.each ( (o.qualifiers||[]) , function ( k , v ) {
							var tmp = [] ;
							$.each ( v , function ( dummy2 , prop2 ) {
								if ( claim.qualifiers === undefined ) return ;
								tmp = tmp.concat ( getQualifierItem(claim.qualifiers,prop2) ) ;
							} ) ;
							em[k] = tmp ;
						} ) ;
						ret.push ( em ) ;
					} ) ;
				} ) ;
				
				if ( o.sort == 'date' ) ret = sortByDate ( ret ) ;
				
				return ret ;
			}


			function getRelationsList ( k1 , props , use_birth_death ) {
				var ret = [] ;
				$.each ( props , function ( dummy0 , prop ) {
					$.each ( (((me.relations||{})[k1]||{})[prop]||[]) , function ( q2 , v ) {
						$.each ( v , function ( dummy , v2 ) {
							if ( wd.items[q2] === undefined ) return ;
							var sp = { q:q2 , dates:{} } ;
							if ( use_birth_death ) {
								if ( wd.items[q2].hasClaims('P569') ) sp.dates.from = wd.items[q2].getClaimDate ( wd.items[q2].raw.claims['P569'][0] ) ;
								if ( wd.items[q2].hasClaims('P570') ) sp.dates.to = wd.items[q2].getClaimDate ( wd.items[q2].raw.claims['P570'][0] ) ;
							} else {
								sp.dates = getDatesFromQualifier(v2.qualifiers) ;
							}
							ret.push ( sp ) ;
						} ) ;
					} ) ;
				} ) ;
				ret = sortByDate ( ret ) ;
				return ret ;
			}




			
			

			

			
			
			// BASE CLASS FOR LANGUAGE RENDERING
			function lang_class () {

				this.listNationalities = function () {
					var countries = i.raw.claims['P27'] ;
					$.each ( (countries||[]) , function ( k , claim ) {
						var country = i.getClaimTargetItemID(claim) ;
						if ( undefined === country ) return ;
						var country_name = wd.items[country].getLabel(lang) ;
						var not_last = k+1 != countries.length ;
						var s = wd_auto_desc.getNationalityFromCountry ( country_name , wd.items[q].raw.claims , {not_last:not_last} ) ;
						h.push ( { label:s , q:country , after:(not_last?'-':' ') } ) ;
					} ) ;
				}

				this.listOccupations = function () {
					var occupations = i.raw.claims['P106'] ;
					$.each ( (occupations||[]) , function ( k , claim ) {
						var occupation = i.getClaimTargetItemID(claim) ;
						if ( occupation === undefined ) return ;
						var not_last = k+1 != occupations.length ;
						h.push ( { q:occupation , after:getSepAfter(occupations,k) } ) ;
					} ) ;
				}

				this.listSentence = function  ( o ) {
					if ( o.data === undefined ) o.data = [] ;
					if ( o.data.length == 0 ) return ;
					if ( undefined !== o.start ) o.start() ;
					$.each ( o.data , function ( k , v ) {
						if ( undefined !== o.item_start ) o.item_start ( function(){h.push ( { q:v.q })} ) ;
						var dates = v.dates ;
						var show_date = false ;
						$.each ( (o.qualifiers||[]) , function ( qual , cb ) { if ( v[qual] !== undefined ) show_date = true } ) ;
						if ( dates !== undefined && ( dates.from !== undefined || dates.to !== undefined ) ) show_date = true ;
						if ( show_date ) {
							if ( undefined !== o.date_start ) o.date_start() ;
							if ( dates.from !== undefined && undefined !== o.date_from ) o.date_from ( function(o2){h.push ( renderDate ( dates.from , o2 ) )} ) ;
							if ( dates.to !== undefined && undefined !== o.date_to ) o.date_to ( function(o2){h.push ( renderDate ( dates.to , o2 ) )} ) ;
							$.each ( (o.qualifiers||[]) , function ( qual , cb ) {
								if ( v[qual] === undefined ) return ;
								if ( v[qual].length == 0 ) return ;
								if ( v[qual][0] === undefined ) return ;
								cb ( v[qual] ) ;
							} ) ;
							if ( undefined !== o.date_end ) o.date_end() ;
						}
						var sep = getSepAfter(o.data,k) ;
						if ( undefined !== o.item_end ) o.item_end ( k , sep ) ;
					} ) ;
					if ( undefined !== o.end ) o.end() ;
				}

			}
			
			
			// TODO make an object of those, one per language, set this to the current language, or fallback
			var language_specs = [] ;
			
			
			// ENGLISH
			language_specs['en'] = new lang_class ;

			language_specs['en'].employers = function ( d ) {
				lang_spec.listSentence ( {
					data : d ,
					start : function() { h.push ( { label:s_he+' worked for ' } ) } ,
					item_start : function(cb) { cb(); h.push ( { label:' ' } ) } ,
					date_from : function(cb) { h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
					date_to : function(cb) { h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
					qualifiers : { job:function(qv){h.push ( { before:'as ' , q:qv[0] , after:' ' } )} } ,
					item_end : function(num,sep) { h.push ( { label:sep+(num+1<d.length?'for ':'') } ) } ,
					end : function() { h.push ( { label:'. ' } ) }
				} ) ;
			}

			language_specs['en'].position = function ( d ) {
				lang_spec.listSentence ( {
					data : d ,
					start : function() { h.push ( { label:s_he+' was'+(is_dead?'':'/is')+' ' } ) } ,
					item_start : function(cb) { cb(); h.push ( { label:' ' } ) } ,
					date_from : function(cb) { h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
					date_to : function(cb) { h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
//					qualifiers : { job:function(qv){h.push ( { before:'as ' , q:qv[0] , after:' ' } )} } ,
//					item_end : function(num,sep) { h.push ( { label:sep+(num+1<d.length?'for ':'') } ) } ,
					end : function() { h.push ( { label:'. ' } ) }
				} ) ;
			}

			language_specs['en'].alma = function ( d ) {
				lang_spec.listSentence ( {
					data : d ,
					start : function() { h.push ( { label:s_he+' studied at ' } ) } ,
					item_start : function(cb) { cb(); h.push ( { label:' ' } ) } ,
					date_from : function(cb) { h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
					date_to : function(cb) { h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
					item_end : function(num,sep) { h.push ( { label:sep } ) } ,
					end : function() { h.push ( { label:'. ' } ) }
				} ) ;
			}
			
			language_specs['en'].field = function ( d ) {
				lang_spec.listSentence ( {
					data : d ,
					start : function() { h.push ( { label:his_er+' field of work include'+(is_dead?'d':'s')+' ' } ) } ,
					item_start : function(cb) { cb(); h.push ( { label:' ' } ) } ,
					item_end : function(num,sep) { h.push ( { label:sep } ) } ,
					end : function() { h.push ( { label:'. ' } ) }
				} ) ;
			}

			language_specs['en'].spouses = function ( d ) {
				lang_spec.listSentence ( {
					data : d ,
					start : function() { h.push ( { label:s_he+' married ' } ) } ,
					item_start : function(cb) { cb(); h.push ( { label:' ' } ) } ,
					date_from : function(cb) { cb(); h.push ( { label:' ' } ) ; } ,
					date_to : function(cb) { h.push ( { label:'(married until ' } ) ; cb() ; h.push ( { label:') ' } ) } ,
					item_end : function(num,sep) { h.push ( { label:sep } ) } ,
					end : function() { h.push ( { label:'. ' } ) }
				} ) ;
			}

			language_specs['en'].children = function ( d ) {
				lang_spec.listSentence ( {
					data : d ,
					start : function() { h.push ( { label:his_er+' children include ' } ) } ,
					item_start : function(cb) { cb() } ,
					item_end : function(num,sep) { h.push ( { label:sep } ) } ,
					end : function() { h.push ( { label:'. ' } ) }
				} ) ;
			}
			
			
			language_specs['en'].firstSentence = function () {
				h.push ( { label:$('#main_title_label').text() , before:'<b>' , after:'</b> ' } ) ;
				h.push ( { label:(is_dead?'was':'is') , after:' a ' } ) ;
				this.listNationalities() ;
				this.listOccupations() ;
				h.push ( { label:'. ' } ) ;
				h.push ( { label:'<br/>' } ) ;
			}


			// Setting current language
			var lang_spec = language_specs['en'] ;

			



			// First sentence
			lang_spec.firstSentence () ;
		
			
			// Birth/parents
			var birthdate = i.raw.claims['P569'] ;
			var birthplace = i.raw.claims['P19'] ;
			var birthname = i.raw.claims['P513'] ;
			if ( birthdate !== undefined || birthplace !== undefined || birthname !== undefined ) {
				h.push ( { label:s_he , after:' was born ' } ) ;
				if ( birthname !== undefined ) h.push ( { label:i.getClaimTargetString(birthname[0]) , before:'<i>' , after:'</i> ' } ) ;
				if ( birthdate !== undefined ) h.push ( renderDate(birthdate[0]) ) ;
				if ( birthplace !== undefined ) addPlace ( { q:i.getClaimTargetItemID(birthplace[0]) , before:'in ' , after:' ' } ) ;
				var father = getParent ( 22 ) ;
				var mother = getParent ( 25 ) ;
				if ( father !== undefined || mother !== undefined ) {
					h.push ( { label:'to ' } ) ;
					if ( father !== undefined ) addPerson ( father , ' ' ) ;
					if ( father !== undefined && mother !== undefined ) h.push ( { label:'and ' } ) ;
					if ( mother !== undefined ) addPerson ( mother , ' ' ) ;
				}
			}
			h.push ( { label:'. ' } ) ;
			h.push ( { label:'<br/>' } ) ;
			
			// Work
			var alma = getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P69'] } ) ;
			var field = getRelatedItemsWithQualifiers ( { properties:['P136','P101'] } ) ;
			var position = getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P39'] } ) ;
			var employers = getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P108'],qualifiers:{'job':['P794']} } ) ;
			lang_spec.alma ( alma ) ;
			lang_spec.field ( field ) ;
			lang_spec.position ( position ) ;
			lang_spec.employers ( employers ) ;
			h.push ( { label:'<br/>' } ) ;
			
			
			// Family
			var spouses = getRelationsList ( 'other' , [26] , false ) ;
			var children = getRelationsList ( 'children' , [40] , true ) ;
			lang_spec.spouses ( spouses ) ;
			lang_spec.children ( children ) ;
			h.push ( { label:'<br/>' } ) ;


			
			// Death
			var deathdate = i.raw.claims['P570'] ;
			var deathplace = i.raw.claims['P20'] ;
			if ( deathdate !== undefined || deathplace !== undefined ) {
				h.push ( { label:s_he , after:' died ' } ) ;
				if ( deathdate !== undefined ) h.push ( renderDate(deathdate[0]) ) ;
				if ( deathplace !== undefined ) addPlace ( { q:i.getClaimTargetItemID(deathplace[0]) , before:'in ' , after:' ' } ) ;
				h.push ( { label:'. ' } ) ;
			}

			var burialplace = i.raw.claims['P119'] ;
			if ( burialplace !== undefined ) {
				addPlace ( { q:i.getClaimTargetItemID(burialplace[0]) , before:s_he+' was buried at ' , after:'. ' } ) ;
			}			
			
			
//			console.log ( h ) ;
			
			var qs = [] ;
			$.each ( h , function ( k , v ) {
				if ( v.q !== undefined ) qs.push ( v.q ) ;
			} ) ;
			wd.getItemBatch ( qs , function () {
				var h2 = '' ;
				
				$.each ( h , function ( k , v ) {
					if ( v === undefined ) return ; // Paranoia
					var main = v.label ;
					if ( main === undefined ) main = wd.items[v.q].getLabel(lang) ;
					if ( v.url !== undefined ) {
						main = "<a href='" + v.url + "'>" + main + "</a>" ;
					} else {
						if ( v.q !== undefined ) main = reasonator.getQlink ( v.q , { label:v.label } ) ;
					}
					h2 += (v.before||'') ;
					h2 += main ;
					h2 += (v.after||'') ;
				} ) ;
				h2 = h2.replace ( /\s+/g , ' ' ) ; // Excessive spaces
				h2 = h2.replace ( /\s([.])/g , '.' ) ; // Space before punctuation
				h2 = h2.replace ( /\s([,])/g , ',' ) ; // Space before punctuation
				h2 = h2.replace ( /\.+/g , '.' ) ; // Multiple end dots
//				console.log ( h2 ) ;
				
				$('div.autodesc').html ( "<div class='lead' style='background-color:#EEE;padding:2px;text-align:left;font-size:12pt'>" + h2 + "</div>" ) ;
			} ) ;
			



		} else { // Generic fallback
			var h = [] ;
			h.push ( reasonator.getItemLinks ( q , { p:reasonator.P.sex,q_desc:true,desc:true } ) . join ( ' ' ) ) ;
			h.push ( reasonator.getItemLinks ( q , { p:reasonator.P.occupation,q_desc:true,desc:true } ) . join ( '/' ) ) ;
			var country = reasonator.getItemLinks ( q , { p:reasonator.P.nationality,q_desc:true,desc:true } ) . join ( ' ' ) ;
			if ( country != '' ) h.push ( reasonator.t('from') ) ;
			h.push ( country ) ;
			h = $.trim(h.join(' ').replace(/\s+/g,' ')) ;
			$('div.autodesc').html ( h ) ;
		}
		
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
		
		var show_location_props = [31,421,669] ;

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
		reasonator.renderMainPropsTable ( show_location_props ) ; // Location properties section
		reasonator.addOther() ; // Render other properties
		reasonator.addMedia() ; // Render images
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
