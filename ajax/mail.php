<?php
parse_str($_POST['form_data'], $form);
$subject = 'Questions from Situations.Me';

define('TO_EMAIL', 'contact@situations.me');
define('SUBJECT', $subject);
define('FROM_EMAIL', $form['conEmail']);

$MESSAGE = 'Hi Admin, <br/><br/>';
$MESSAGE .= 'You got a question from Situation.Me. User details and Message are noted bellow: <br/><br/>';
$MESSAGE .= 'Name : ' . $form['conName'] . '<br/>';
$MESSAGE .= 'Email : ' . $form['conEmail'] . '<br/>';
$MESSAGE .= 'Message : ' . $form['conQues'] . '<br/>';
if (isset($form['conWeb']) && !empty($form['conWeb'])):
    $MESSAGE .= 'Website : ' . $form['conWeb'] . '<br/>';
endif;

$MESSAGE .= 'Message : <br/>' . $form['message'] . '<br/><br/>';
$MESSAGE .= 'Regards';

$HEADERS = "MIME-Version: 1.0" . "\r\n";
$HEADERS .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$HEADERS .= 'From: <' . FROM_EMAIL . '>' . "\r\n";

mail(TO_EMAIL, SUBJECT, $MESSAGE, $HEADERS);
echo 1;
exit();
