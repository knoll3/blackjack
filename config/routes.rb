Rails.application.routes.draw do
	root 'static_pages#index'
	resources :games do 
		resources :cards
	end
end
