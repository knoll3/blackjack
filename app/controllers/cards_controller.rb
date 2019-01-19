class CardsController < ApplicationController
	
	def index
		@game = Game.find(params[:game_id])
		render json: @game.cards
	end
end
