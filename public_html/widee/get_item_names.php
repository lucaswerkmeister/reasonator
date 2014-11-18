<?PHP

include_once ( "php/common.php" ) ;

header('Content-Type: application/json');
//header('Content-Type: text/plain');

$db = openDB ( 'wikidata' , 'wikidata' ) ;

$qs = preg_replace ( '/[^0-9,]/' , '' , get_request ( 'qs' , '' ) ) ;
$langs = explode ( ',' , $db->real_escape_string ( get_request ( 'langs' , 'en' ) ) ) ;
$prefix = preg_replace ( '/[^PQ]/' , '' , get_request ( 'type' , 'Q' ) ) ;

$base = preg_replace ( '/\D/' , '' , get_request ( 'base' , '' ) ) ;
$base_only = get_request ( 'only' , '' ) ;

$out = array ( 'entities' => array() ) ;

if ( $base != '' ) {
	$sql = "select pl_namespace,pl_title from wb_entity_per_page,pagelinks WHERE pl_from=epp_page_id and epp_entity_type='item' and epp_entity_id=$base" ;
	if ( $base_only == 'Q' ) $sql .= " AND pl_namespace=0" ;
	if ( $base_only == 'P' ) $sql .= " AND pl_namespace=120" ;
	$qs = array() ;
	$ps = array() ;
	if(!$result = $db->query($sql)) die('There was an error running the query [' . $db->error . ']1'."\n$sql\n");
	while($o = $result->fetch_object()){
		if ( $o->pl_namespace == 0 ) $qs[] = $o->pl_title ;
		else if ( $o->pl_namespace == 120 ) $ps[] = $o->pl_title ;
	}
	if ( $base_only != 'P' ) run ( implode ( ',' , $qs ) , $langs , 'Q' ) ;
	if ( $base_only != 'Q' ) run ( implode ( ',' , $ps ) , $langs , 'P' ) ;
} else {
	run ( $qs , $langs , $prefix ) ;
}

function run ( $qs , $langs , $prefix ) {
	global $out , $db ;
	$type = $prefix == 'Q' ? 'item' : 'property' ;
	$qs = preg_replace ( '/[^0-9,]/' , '' , $qs ) ;
	$sql = "SELECT term_entity_id,term_language,term_type,term_entity_type,term_text FROM wb_terms WHERE term_entity_id IN ($qs) AND term_type IN ('label','description') AND term_language IN ('" . implode("','",$langs) . "')" ;
	$out['sql'] = $sql ;
	if(!$result = $db->query($sql)) die('There was an error running the query [' . $db->error . ']2'."\n$sql\n");
	while($o = $result->fetch_object()){
		if ( $o->term_entity_type != $type ) continue ;
		$tt = $o->term_type . 's' ;
		$out['entities'][$prefix.$o->term_entity_id][$tt][$o->term_language] = array ( "language" => $o->term_language , "value" => $o->term_text ) ;
	}

	foreach ( $out['entities'] AS $k => $v ) {
		$out['entities'][$k]['id'] = $k ;
		$out['entities'][$k]['title'] = ( $prefix == 'P' ? "Property:" : '' ) . $k ;
	}

	if ( $prefix == 'P' ) {
		$sql = "SELECT pi_property_id,pi_type FROM wb_property_info WHERE pi_property_id IN ($qs)" ;
		if(!$result = $db->query($sql)) die('There was an error running the query [' . $db->error . ']3'."\n$sql\n");
		while($o = $result->fetch_object()){
			$out['entities']['P'.$o->pi_property_id]['datatype'] = $o->pi_type ;
		}
	}
}


print json_encode ( $out ) ;

?>