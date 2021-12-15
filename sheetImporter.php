<?php
/**
* Plugin Name: Sheet Importer
* Plugin URI: http://tyronhayman.me
* Description: Wordpress plugin owned by and developed for Effinlazy
* Version: 1.0.0
* Author: Tyron
* Author URI: http://tyronhayman.me
* License: GPL2
*/

// Import data from Google Sheet
add_action( 'wp_enqueue_scripts', 'si_script_load' );
function si_script_load(){
 $plugin_url = plugin_dir_url( __FILE__ );
  wp_enqueue_style( 'style',  $plugin_url . "/styles.css");
  wp_enqueue_script( 'si-custom-macy', 'https://cdn.jsdelivr.net/npm/macy@2', array( 'jquery' ) );
  wp_enqueue_script( 'si-custom-script', $plugin_url . '/js/si-scripts.js', array( 'jquery' ) );
}

// Add Short code
function si_shortcodes_init(){
 add_shortcode( 'si_sheet', 'si_shortcode_handler' );
}
add_action('init', 'si_shortcodes_init');

function si_shortcode_handler( $atts ) {
  si_footer_scripts();
 $div = shortcode_atts( array(
 'id' => 'si_wrapper'
 ), $atts );
 $output = '<div id="' . $div['id'] . '" class="isOpen"></div><div id="si_fullTextWrapper"><div class="container-fluid"><div class="row justify-content-between"><div class="col-md-4"><a href="#" class="si_backBtn btn"><i class="fas fa-arrow-left" aria-hidden="true"></i> Back to posts</a><img src="" alt=""/></div><div class="col-md-7"><h2>Artickle Title</h2><p></p></div></div></div></div>';
 return $output;
}

// add code to footer for GAPI
function si_footer_scripts(){
?>
<script async defer src="https://apis.google.com/js/api.js"
  onload=""
  onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script>
<?php
};


?>
