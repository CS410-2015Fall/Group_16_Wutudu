Rails.application.routes.draw do

  resources :pre_wutudus
  match '/users' => 'users#create', via: :post
  match '/users' => 'users#show', via: :get
  match '/login' => 'sessions#create', via: :post
  match '/logout' => 'sessions#destroy', via: :delete

  match '/friends' => 'friendships#show', via: :get
  match '/friends' => 'friendships#create', via: :post
  match '/friends' => 'friendships#update', via: :put
  match '/friends' => 'friendships#destroy', via: :delete

  match '/groups' => 'groups#show', via: :get
  match '/groups' => 'groups#create', via: :post

  match '/groups/:gid' => 'group_details#show', via: :get

  match '/groups/:gid/users' => 'group_users#create', via: :post
  match '/groups/:gid/users' => 'group_users#update', via: :put
  match '/groups/:gid/users' => 'group_users#destroy', via: :delete

  match '/groups/:gid/pre_wutudu'     => 'pre_wutudus#create', via: :post
  match '/groups/:gid/pre_wutudu/:pid' => 'pre_wutudus#show', via: :get
  match '/groups/:gid/pre_wutudu/:pid' => 'pre_wutudus#destroy', via: :delete

  match '/groups/:gid/pre_wutudu/:pid/answers' => 'user_answers#create', via: :post
  match '/groups/:gid/pre_wutudu/:pid/answers' => 'user_answers#show', via: :get

  match '/groups/:gid/pre_wutudu/:pid/finish' =>  'wutudu_events#create', via: :post
  match '/groups/:gid/wutudu_event/:wid' =>  'wutudu_events#show', via: :get

  root  'application#show'
end
