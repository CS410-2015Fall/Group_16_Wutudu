Rails.application.routes.draw do
  resources :widgets

  match '/users' => 'users#create', via: :post
  match '/users' => 'users#show', via: :get
  match '/login' => 'session#create', via: :post
  match '/logout' => 'session#destroy', via: :delete
end
