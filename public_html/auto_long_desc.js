/**
 * @author Magnus Manske
 */


// BASE CLASS FOR LANGUAGE RENDERING
function lang_class () {

	this.init = function () {
		this.show_people_dates = false ;
		this.lang = reasonator.getMainLang() ;
		this.wd = reasonator.wd ;
		this.h = [] ;
		this.i = this.wd.items[reasonator.q] ;
		this.is_dead = this.i.hasClaims ( 'P570' ) ;
	}

	this.run_person = function ( callback ) {
		this.setup() ;
		this.addFirstSentence () ;
		this.addBirthText () ;
		this.addWorkText () ;
		this.addFamilyText () ;
		this.addDeathText () ;
		this.renderHTML ( callback ) ;
	}
	
	this.renderDate = function ( claim , o ) {
		var me = this ;
		if ( o === undefined ) o = {} ;
		var ret = { after:' ' } ;
		var d = (claim.time===undefined) ? (claim.datavalue===undefined?this.i.getClaimDate(claim):claim.datavalue.value) : claim ;

		var pre = d.time.substr(0,1) == '+' ? 1 : -1 ;
		var dp = d.time.substr(1).split(/[-T:Z]/) ;
		var year = dp[0]*1 ;
		var month = reasonator.pad ( dp[1] , 2 ) ;
		var day = reasonator.pad ( dp[2] , 2 ) ;
		
		var trans = me.renderDateByPrecision ( pre , year , month , day , d.precision , o.no_prefix ) ;
		ret.label = trans.label ;
		ret.before = trans.before ;
	
		if ( o.just_year ) return { label:year } ;

		var iso = d.time ; // Fallback
		var label = d.time ; // Fallback
	
		ret.url = reasonator.getSelfURL ( { date:trans.iso } ) ;

		return ret ;
	}

	this.getParent = function ( p ) {
		if ( reasonator.main_type_object.relations === undefined ) return ;
		if ( reasonator.main_type_object.relations.parents === undefined ) return ;
		if ( reasonator.main_type_object.relations.parents[p] === undefined ) return ;
		var ret ;
		$.each ( reasonator.main_type_object.relations.parents[p] , function ( k , v ) { ret = k ; return false } ) ;
		return ret ;
	}

	this.addPerson = function ( pq , after ) {
		var me = this ;
		me.h.push ( { q:pq } ) ;
	
		var born = me.wd.items[pq].raw.claims['P569'] ;
		var died = me.wd.items[pq].raw.claims['P570'] ;

		if ( me.show_people_dates && ( born !== undefined || died !== undefined ) ) {
			me.h.push ( { label:' (' } ) ;
			if ( born !== undefined ) me.h.push ( me.renderDate ( born[0] , {just_year:true} ) ) ;
			if ( born !== undefined && died !== undefined ) me.h.push ( { label:'&ndash;' } ) ;
			if ( died !== undefined ) me.h.push ( me.renderDate ( died[0] , {just_year:true} ) ) ;
			me.h.push ( { label:')' } ) ;
		}
	
		if ( after !== undefined && after != '' ) me.h.push ( { label:after } ) ;
	}

	this.addPlace = function ( o ) {
		if ( o.before !== undefined ) this.h.push ( { label:o.before } ) ;
		this.h.push ( { q:o.q } ) ; // TODO country, city etc.
		if ( o.after !== undefined ) this.h.push ( { label:o.after } ) ;
	}

	this.getSepAfter = function ( arr , pos ) {
		if ( pos+1 == arr.length ) return ' ' ;
		if ( pos == 0 && arr.length == 2 ) return ' and ' ;
		if ( arr.length == pos+2 ) return ', and ' ;
		return ', ' ;
	}

	this.getQualifierItem = function ( qualifiers , prop ) {
		if ( qualifiers[prop] === undefined ) return ;
		if ( qualifiers[prop][0].datavalue === undefined ) return ;
		if ( qualifiers[prop][0].datavalue.value === undefined ) return ;
		return 'Q' + qualifiers[prop][0].datavalue.value['numeric-id'] ;
	}

	this.getDatesFromQualifier = function ( qualifiers ) {
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

	this.sortByDate = function ( x ) {
		return x.sort ( function ( a , b ) {
			if ( a.dates.from !== undefined && b.dates.from !== undefined ) {
				return a.dates.from.time == b.dates.from.time ? 0 : ( a.dates.from.time < b.dates.from.time ? -1 : 1 ) ;
			} else if ( a.dates.to !== undefined && b.dates.to !== undefined ) {
				return a.dates.to.time == b.dates.to.time ? 0 : ( a.dates.to.time < b.dates.to.time ? -1 : 1 ) ;
			}
			return a.q == b.q ? 0 : ( a.q < b.q ? -1 : 1 ) ;
		} ) ;
	}

	this.getRelatedItemsWithQualifiers = function ( o ) { // qualifiers need to be item links
		var me = this ;
		if ( o === undefined ) o = {} ;

		var ret = [] ;
		$.each ( (o.properties||[]) , function ( dummy , prop ) {
			$.each ( (me.i.raw.claims[prop]||[]) , function ( k , claim ) {
				var eq = me.i.getClaimTargetItemID(claim) ;
				if ( undefined === eq ) return ;
				var em = { q:eq } ;
				if ( o.dates ) em.dates = me.getDatesFromQualifier(claim.qualifiers) ;
				$.each ( (o.qualifiers||[]) , function ( k , v ) {
					var tmp = [] ;
					$.each ( v , function ( dummy2 , prop2 ) {
						if ( claim.qualifiers === undefined ) return ;
						tmp = tmp.concat ( me.getQualifierItem(claim.qualifiers,prop2) ) ;
					} ) ;
					em[k] = tmp ;
				} ) ;
				ret.push ( em ) ;
			} ) ;
		} ) ;
	
		if ( o.sort == 'date' ) ret = this.sortByDate ( ret ) ;
	
		return ret ;
	}

	this.getRelationsList = function ( k1 , props , use_birth_death ) {
		var me = this ;
		var ret = [] ;
		$.each ( props , function ( dummy0 , prop ) {
			$.each ( (((reasonator.main_type_object.relations||{})[k1]||{})[prop]||[]) , function ( q2 , v ) {
				$.each ( v , function ( dummy , v2 ) {
					if ( me.wd.items[q2] === undefined ) return ;
					var sp = { q:q2 , dates:{} } ;
					if ( use_birth_death ) {
						if ( me.wd.items[q2].hasClaims('P569') ) sp.dates.from = me.wd.items[q2].getClaimDate ( me.wd.items[q2].raw.claims['P569'][0] ) ;
						if ( me.wd.items[q2].hasClaims('P570') ) sp.dates.to = me.wd.items[q2].getClaimDate ( me.wd.items[q2].raw.claims['P570'][0] ) ;
					} else {
						sp.dates = me.getDatesFromQualifier(v2.qualifiers) ;
					}
					ret.push ( sp ) ;
				} ) ;
			} ) ;
		} ) ;
		ret = this.sortByDate ( ret ) ;
		return ret ;
	}

	this.listNationalities = function () {
		var me = this ;
		var countries = me.i.raw.claims['P27'] ;
		$.each ( (countries||[]) , function ( k , claim ) {
			var country = me.i.getClaimTargetItemID(claim) ;
			if ( undefined === country ) return ;
			var country_name = me.wd.items[country].getLabel(me.lang) ;
			var not_last = k+1 != countries.length ;
			var s = wd_auto_desc.getNationalityFromCountry ( country_name , me.wd.items[reasonator.q].raw.claims , {not_last:not_last} ) ;
			me.h.push ( { label:s , q:country , after:(not_last?'-':' ') } ) ;
		} ) ;
	}

	this.listOccupations = function () {
		var me = this ;
		var occupations = me.i.raw.claims['P106'] ;
		$.each ( (occupations||[]) , function ( k , claim ) {
			var occupation = me.i.getClaimTargetItemID(claim) ;
			if ( occupation === undefined ) return ;
			var not_last = k+1 != occupations.length ;
			me.h.push ( { q:occupation , after:me.getSepAfter(occupations,k) } ) ;
		} ) ;
	}

	this.simpleList = function ( d , start , end ) {
		var me = this ;
		this.listSentence ( {
			data : d ,
			start : function() { me.h.push ( { label:start } ) } ,
			item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
			item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
			end : function() { me.h.push ( { label:end } ) }
		} ) ;
	}

	this.listSentence = function  ( o ) {
		var me = this ;
		if ( o.data === undefined ) o.data = [] ;
		if ( o.data.length == 0 ) return ;
		if ( undefined !== o.start ) o.start() ;
		$.each ( o.data , function ( k , v ) {
			if ( undefined !== o.item_start ) o.item_start ( function(){me.h.push ( { q:v.q })} ) ;
			var dates = v.dates ;
			var show_date = false ;
			$.each ( (o.qualifiers||[]) , function ( qual , cb ) { if ( v[qual] !== undefined ) show_date = true } ) ;
			if ( dates !== undefined && ( dates.from !== undefined || dates.to !== undefined ) ) show_date = true ;
			if ( show_date ) {
				if ( undefined !== o.date_start ) o.date_start() ;
				if ( dates.from !== undefined && undefined !== o.date_from ) o.date_from ( function(o2){me.h.push ( me.renderDate ( dates.from , o2 ) )} ) ;
				if ( dates.to !== undefined && undefined !== o.date_to ) o.date_to ( function(o2){me.h.push ( me.renderDate ( dates.to , o2 ) )} ) ;
				$.each ( (o.qualifiers||[]) , function ( qual , cb ) {
					if ( v[qual] === undefined ) return ;
					if ( v[qual].length == 0 ) return ;
					if ( v[qual][0] === undefined ) return ;
					cb ( v[qual] ) ;
				} ) ;
				if ( undefined !== o.date_end ) o.date_end() ;
			}
			var sep = me.getSepAfter(o.data,k) ;
			if ( undefined !== o.item_end ) o.item_end ( k , sep ) ;
		} ) ;
		if ( undefined !== o.end ) o.end() ;
	}


	this.addWorkText = function () {
		var alma = this.getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P69'] } ) ;
		var field = this.getRelatedItemsWithQualifiers ( { properties:['P136','P101'] } ) ;
		var position = this.getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P39'] } ) ;
		var member = this.getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P463'] } ) ;
		var employers = this.getRelatedItemsWithQualifiers ( { dates:true,sort:'date',properties:['P108'],qualifiers:{'job':['P794']} } ) ;
		this.alma ( alma ) ;
		this.field ( field ) ;
		this.position ( position ) ;
		this.member ( member ) ;
		this.employers ( employers ) ;
		this.h.push ( { label:'<br/>' } ) ;
	}

	this.addFamilyText = function () {
		var spouses = this.getRelationsList ( 'other' , [26] , false ) ;
		var children = this.getRelationsList ( 'children' , [40] , true ) ;
		this.spouses ( spouses ) ;
		this.children ( children ) ;
		this.h.push ( { label:'<br/>' } ) ;
	}


	this.renderHTML = function ( callback ) {
		var me = this ;
		var qs = [] ;
		$.each ( me.h , function ( k , v ) {
			if ( v.q !== undefined ) qs.push ( v.q ) ;
		} ) ;
		me.wd.getItemBatch ( qs , function () {
			var h2 = '' ;
	
			$.each ( me.h , function ( k , v ) {
				if ( v === undefined ) return ; // Paranoia
				var main = v.label ;
				if ( main === undefined ) main = me.wd.items[v.q].getLabel(me.lang) ;
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
			h2 = h2.replace ( /(<br\/>\s*)+/g , '<br/>' ) ; // Multiple new lines
			callback ( h2 ) ;
		} ) ;
	}
	
}


// TODO make an object of those, one per language, set this to the current language, or fallback
var language_specs = [] ;

//________________________________________________________________________________________________________________________________________________________________

// ENGLISH
language_specs['en'] = new lang_class ;

language_specs['en'].setup = function () {
	this.init() ;
	this.month_label = [ '' , 'January','February','March','April','May','June','July','August','September','October','November','December' ] ; // First one needs to be empty!!
	this.is_male = !this.i.hasClaimItemLink('P21','Q6581072') ;
	this.s_he = (this.is_male?'He':'She') ;
	this.his_er = (this.is_male?'His':'Her') ;
}

language_specs['en'].renderDateByPrecision = function ( pre , year , month , day , precision , no_prefix ) {
	var me = this ;
	var ret = {} ;
	if ( precision <= 9 ) {
		ret.iso = year*pre ;
		ret.label = year ;
		if ( !no_prefix ) ret.before = 'in ' ;
	} else if ( precision == 10 ) {
		ret.iso = year*pre + '-' + month ;
		ret.label = me.month_label[month*1] + ' ' + year ;
		if ( !no_prefix ) ret.before = 'in ' ;
	} else if ( precision == 11 ) {
		ret.iso = year*pre + '-' + month + '-' + day ;
		ret.label = me.month_label[month*1] + ' ' + (day*1) + ', ' + year ;
		if ( !no_prefix ) ret.before = 'on ' ;
	}
	if ( pre == -1 ) ret.after = " <small>B.C.E.</small>" + ret.after ;
	return ret ;
}

language_specs['en'].employers = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' worked for ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
		qualifiers : { job:function(qv){me.h.push ( { before:'as ' , q:qv[0] , after:' ' } )} } ,
		item_end : function(num,sep) { me.h.push ( { label:sep+(num+1<d.length?'for ':'') } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['en'].position = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' was'+(me.is_dead?'':'/is')+' ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
//					qualifiers : { job:function(qv){me.h.push ( { before:'as ' , q:qv[0] , after:' ' } )} } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['en'].member = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' was'+(me.is_dead?'':'/is')+' a member of ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
//					qualifiers : { job:function(qv){me.h.push ( { before:'as ' , q:qv[0] , after:' ' } )} } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['en'].alma = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' studied at ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'from ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'until ' } ) ; cb({no_prefix:true}) } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['en'].field = function ( d ) { var me=this; this.simpleList ( d , me.his_er+' field of work include'+(me.is_dead?'d':'s')+' ' , '. ' ) ; }
language_specs['en'].cause_of_death = function ( d ) { this.simpleList ( d , 'of ' , ' ' ) ; }
language_specs['en'].killer = function ( d ) { this.simpleList ( d , 'by ' , ' ' ) ; }
language_specs['en'].sig_event = function ( d ) { this.simpleList ( d , this.s_he+' played a role in ' , '.' ) ; }

language_specs['en'].spouses = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' married ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { cb(); me.h.push ( { label:' ' } ) ; } ,
		date_to : function(cb) { me.h.push ( { label:'(married until ' } ) ; cb() ; me.h.push ( { label:') ' } ) } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['en'].children = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.his_er+' children include ' } ) } ,
		item_start : function(cb) { cb() } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}


language_specs['en'].addFirstSentence = function () {
	var me = this ;
	me.h.push ( { label:$('#main_title_label').text() , before:'<b>' , after:'</b> ' } ) ;
	me.h.push ( { label:(this.is_dead?'was':'is') , after:' a ' } ) ;
	this.listNationalities() ;
	this.listOccupations() ;
	me.h.push ( { label:'. ' } ) ;
	if ( me.h.length == 3 ) me.h = [] ; // No information, skip it.
	var sig_event = this.getRelatedItemsWithQualifiers ( { properties:['P793'] } ) ;
	me.sig_event ( sig_event ) ;
	me.h.push ( { label:'<br/>' } ) ;
}

language_specs['en'].addBirthText = function () {
	var me = this ;
	var birthdate = me.i.raw.claims['P569'] ;
	var birthplace = me.i.raw.claims['P19'] ;
	var birthname = me.i.raw.claims['P513'] ;
	if ( birthdate !== undefined || birthplace !== undefined || birthname !== undefined ) {
		me.h.push ( { label:me.s_he , after:' was born ' } ) ;
		if ( birthname !== undefined ) me.h.push ( { label:me.i.getClaimTargetString(birthname[0]) , before:'<i>' , after:'</i> ' } ) ;
		if ( birthdate !== undefined ) me.h.push ( me.renderDate(birthdate[0]) ) ;
		if ( birthplace !== undefined ) me.addPlace ( { q:me.i.getClaimTargetItemID(birthplace[0]) , before:'in ' , after:' ' } ) ;
		var father = me.getParent ( 22 ) ;
		var mother = me.getParent ( 25 ) ;
		if ( father !== undefined || mother !== undefined ) {
			me.h.push ( { label:'to ' } ) ;
			if ( father !== undefined ) me.addPerson ( father , ' ' ) ;
			if ( father !== undefined && mother !== undefined ) me.h.push ( { label:'and ' } ) ;
			if ( mother !== undefined ) me.addPerson ( mother , ' ' ) ;
		}
		me.h.push ( { label:'. ' } ) ;
		me.h.push ( { label:'<br/>' } ) ;
	}
}


language_specs['en'].addDeathText = function () {
	var me = this ;
	var deathdate = me.i.raw.claims['P570'] ;
	var deathplace = me.i.raw.claims['P20'] ;
	var deathcause = me.i.hasClaims('P509') ;
	var killer = me.i.hasClaims('P157') ;
	if ( deathdate !== undefined || deathplace !== undefined || deathcause || killer ) {
		me.h.push ( { label:me.s_he , after:' died ' } ) ;
		if ( deathcause !== undefined ) me.cause_of_death ( me.getRelatedItemsWithQualifiers ( { properties:['P509'] } ) ) ;
		if ( killer !== undefined ) me.killer ( me.getRelatedItemsWithQualifiers ( { properties:['P157'] } ) ) ;
		if ( deathdate !== undefined ) me.h.push ( me.renderDate(deathdate[0]) ) ;
		if ( deathplace !== undefined ) me.addPlace ( { q:me.i.getClaimTargetItemID(deathplace[0]) , before:'in ' , after:' ' } ) ;
		me.h.push ( { label:'. ' } ) ;
	}
	var burialplace = me.i.raw.claims['P119'] ;
	if ( burialplace !== undefined ) {
		me.addPlace ( { q:me.i.getClaimTargetItemID(burialplace[0]) , before:me.s_he+' was buried at ' , after:'. ' } ) ;
	}
}


//________________________________________________________________________________________________________________________________________________________________

// Dutch
language_specs['nl'] = new lang_class ;

language_specs['nl'].setup = function () {
	this.init() ;
	this.month_label = [ '' , 'januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december' ] ; // First one needs to be empty!!
	this.is_male = !this.i.hasClaimItemLink('P21','Q6581072') ;
	this.s_he = (this.is_male?'Hij':'Zij') ;
	this.his_er = (this.is_male?'Zijn':'Haar') ;
}

language_specs['nl'].renderDateByPrecision = function ( pre , year , month , day , precision , no_prefix ) {
	var me = this ;
	var ret = {} ;
	if ( precision <= 9 ) {
		ret.iso = year*pre ;
		ret.label = year ;
		if ( !no_prefix ) ret.before = 'in ' ;
	} else if ( precision == 10 ) {
		ret.iso = year*pre + '-' + month ;
		ret.label = me.month_label[month*1] + ' ' + year ;
		if ( !no_prefix ) ret.before = 'in ' ;
	} else if ( precision == 11 ) {
		ret.iso = year*pre + '-' + month + '-' + day ;
		ret.label = me.month_label[month*1] + ' ' + (day*1) + ', ' + year ;
		if ( !no_prefix ) ret.before = 'on ' ;
	}
	if ( pre == -1 ) ret.after = " <small>B.C.E.</small>" + ret.after ;
	return ret ;
}

language_specs['nl'].employers = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' werkte voor ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'van ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'tot ' } ) ; cb({no_prefix:true}) } ,
		qualifiers : { job:function(qv){me.h.push ( { before:'als ' , q:qv[0] , after:' ' } )} } ,
		item_end : function(num,sep) { me.h.push ( { label:sep+(num+1<d.length?'voor ':'') } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['nl'].position = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' was'+(me.is_dead?'':'/is')+' ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'van ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'tot ' } ) ; cb({no_prefix:true}) } ,
//                    qualifiers : { job:function(qv){me.h.push ( { before:'als ' , q:qv[0] , after:' ' } )} } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['nl'].member = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' was'+(me.is_dead?'':'/is')+' een lid van ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'van ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'tot ' } ) ; cb({no_prefix:true}) } ,
//                    qualifiers : { job:function(qv){me.h.push ( { before:'als ' , q:qv[0] , after:' ' } )} } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['nl'].alma = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' studeerde op de ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { me.h.push ( { label:'van ' } ) ; cb({no_prefix:true}) } ,
		date_to : function(cb) { me.h.push ( { label:'tot ' } ) ; cb({no_prefix:true}) } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['nl'].field = function ( d ) { var me=this; this.simpleList ( d , me.his_er+' werkveld '+(this.is_dead?'omvatte':'omvat')+' ' , '. ' ) ; }
language_specs['nl'].cause_of_death = function ( d ) { this.simpleList ( d , 'ten gevolge van ' , ' ' ) ; }
language_specs['nl'].killer = function ( d ) { this.simpleList ( d , 'door ' , ' ' ) ; }
language_specs['nl'].sig_event = function ( d ) { this.simpleList ( d , this.s_he+' speelde een rol in ' , '.' ) ; }

language_specs['nl'].spouses = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.s_he+' trouwde ' } ) } ,
		item_start : function(cb) { cb(); me.h.push ( { label:' ' } ) } ,
		date_from : function(cb) { cb(); me.h.push ( { label:' ' } ) ; } ,
		date_to : function(cb) { me.h.push ( { label:'(getrouwd tot ' } ) ; cb() ; me.h.push ( { label:') ' } ) } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}

language_specs['nl'].children = function ( d ) {
	var me = this ;
	this.listSentence ( {
		data : d ,
		start : function() { me.h.push ( { label:me.his_er+' kinderen zijn ' } ) } ,
		item_start : function(cb) { cb() } ,
		item_end : function(num,sep) { me.h.push ( { label:sep } ) } ,
		end : function() { me.h.push ( { label:'. ' } ) }
	} ) ;
}


language_specs['nl'].addFirstSentence = function () {
	var me = this ;
	me.h.push ( { label:$('#main_title_label').text() , before:'<b>' , after:'</b> ' } ) ;
	me.h.push ( { label:(this.is_dead?'was':'is') , after:' een ' } ) ;
	this.listNationalities() ;
	this.listOccupations() ;
	me.h.push ( { label:'. ' } ) ;
	if ( me.h.length == 3 ) me.h = [] ; // No information, skip it.
	var sig_event = this.getRelatedItemsWithQualifiers ( { properties:['P793'] } ) ;
	me.sig_event ( sig_event ) ;
	me.h.push ( { label:'<br/>' } ) ;
}

language_specs['nl'].addBirthText = function () {
	var me = this ;
	var birthdate = me.i.raw.claims['P569'] ;
	var birthplace = me.i.raw.claims['P19'] ;
	var birthname = me.i.raw.claims['P513'] ;
	if ( birthdate !== undefined || birthplace !== undefined || birthname !== undefined ) {
		me.h.push ( { label:me.s_he , after:' werd geboren ' } ) ;
		if ( birthname !== undefined ) me.h.push ( { label:me.i.getClaimTargetString(birthname[0]) , before:'<i>' , after:'</i> ' } ) ;
		if ( birthdate !== undefined ) me.h.push ( me.renderDate(birthdate[0]) ) ;
		if ( birthplace !== undefined ) me.addPlace ( { q:me.i.getClaimTargetItemID(birthplace[0]) , before:'in ' , after:' ' } ) ;
		var father = me.getParent ( 22 ) ;
		var mother = me.getParent ( 25 ) ;
		if ( father !== undefined || mother !== undefined ) {
			me.h.push ( { label:'als kind van ' } ) ;
			if ( father !== undefined ) me.addPerson ( father , ' ' ) ;
			if ( father !== undefined && mother !== undefined ) me.h.push ( { label:'en ' } ) ;
			if ( mother !== undefined ) me.addPerson ( mother , ' ' ) ;
		}
		me.h.push ( { label:'. ' } ) ;
		me.h.push ( { label:'<br/>' } ) ;
	}
}


language_specs['nl'].addDeathText = function () {
	var me = this ;
	var deathdate = me.i.raw.claims['P570'] ;
	var deathplace = me.i.raw.claims['P20'] ;
	var deathcause = me.i.hasClaims('P509') ;
	var killer = me.i.hasClaims('P157') ;
	if ( deathdate !== undefined || deathplace !== undefined || deathcause || killer ) {
		me.h.push ( { label:me.s_he , after:' stierf ' } ) ;
		if ( deathcause !== undefined ) me.cause_of_death ( me.getRelatedItemsWithQualifiers ( { properties:['P509'] } ) ) ;
		if ( killer !== undefined ) me.killer ( me.getRelatedItemsWithQualifiers ( { properties:['P157'] } ) ) ;
		if ( deathdate !== undefined ) me.h.push ( me.renderDate(deathdate[0]) ) ;
		if ( deathplace !== undefined ) me.addPlace ( { q:me.i.getClaimTargetItemID(deathplace[0]) , before:'in ' , after:' ' } ) ;
		me.h.push ( { label:'. ' } ) ;
	}
	var burialplace = me.i.raw.claims['P119'] ;
	if ( burialplace !== undefined ) {
		me.addPlace ( { q:me.i.getClaimTargetItemID(burialplace[0]) , before:me.s_he+' werd begraven in ' , after:'. ' } ) ;
	}
}

//________________________________________________________________________________________________________________________________________________________________
