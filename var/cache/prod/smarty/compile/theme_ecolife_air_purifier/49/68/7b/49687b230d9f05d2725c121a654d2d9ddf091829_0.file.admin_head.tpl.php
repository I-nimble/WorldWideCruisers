<?php
/* Smarty version 3.1.43, created on 2022-08-25 13:29:38
  from '/var/www/html/prestashop/modules/ph_instagram/views/templates/hook/admin_head.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.43',
  'unifunc' => 'content_6307b182e0d859_27084468',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '49687b230d9f05d2725c121a654d2d9ddf091829' => 
    array (
      0 => '/var/www/html/prestashop/modules/ph_instagram/views/templates/hook/admin_head.tpl',
      1 => 1653046660,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6307b182e0d859_27084468 (Smarty_Internal_Template $_smarty_tpl) {
echo '<script'; ?>
 type="text/javascript">
    var PH_INSTA_LINK_AJAX = "<?php echo call_user_func_array($_smarty_tpl->registered_plugins[ 'modifier' ][ 'escape' ][ 0 ], array( $_smarty_tpl->tpl_vars['linkAjaxBo']->value,'quotes','UTF-8' ));?>
";
<?php echo '</script'; ?>
>
<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo call_user_func_array($_smarty_tpl->registered_plugins[ 'modifier' ][ 'escape' ][ 0 ], array( $_smarty_tpl->tpl_vars['linkJsAdmin']->value,'quotes','UTF-8' ));?>
" defer="defer"><?php echo '</script'; ?>
><?php }
}