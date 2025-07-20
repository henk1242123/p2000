<?php
header('Content-Type: application/json');

$feedUrl = filter_input(INPUT_GET, 'feed', FILTER_VALIDATE_URL);
if (!$feedUrl) {
  echo json_encode(['error' => 'Ongeldige feed URL']);
  exit;
}

$rss = @simplexml_load_file($feedUrl);
if (!$rss) {
  echo json_encode(['error' => 'Kan feed niet laden']);
  exit;
}

$items = [];
foreach ($rss->channel->item as $item) {
  $items[] = [
    'title' => (string)$item->title,
    'pubDate' => (string)$item->pubDate,
    'link' => (string)$item->link
  ];
}

echo json_encode(['items' => $items]);
