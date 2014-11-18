#!/usr/bin/php
<?PHP

include_once ( "/data/project/reasonator/public_html/widee/php/common.php" ) ;

$db = openDB ( 'wikidata' , 'wikidata' ) ;

$sql = 'select pl_title,count(*) as cnt from pagelinks where pl_from_namespace=0 and pl_namespace=120 group by pl_title' ;


$out = '' ;

$extids = array() ;
$w = file_get_contents ( 'http://meta.wikimedia.org/w/index.php?title=Reasonator/stringprops&action=raw' ) ;
$w = explode ( "\n" , $w ) ;
foreach ( $w AS $l ) {
	if ( !preg_match ( '/^\|.*?\|\|\s*(\d+)\s*\|\|\s*(h.+!ID!.*)$/' , $l , $m ) ) continue ;
	$extids['P'.$m[1]] = $m[2] ;
}
$out .= "var ext_ids = " . json_encode($extids) . " ;\n" ;

$propstats = array() ;
if(!$result = $db->query($sql)) die('There was an error running the query [' . $db->error . ']1'."\n$sql\n");
while($o = $result->fetch_object()){
	$propstats[$o->pl_title] = $o->cnt ;
}
$out .= "var propstats = " . json_encode($propstats) . " ;\n" ;


file_put_contents ( '/data/project/reasonator/public_html/widee/static.js' , $out ) ;

?>