class GamesController < ApplicationController
	def index
		render json: Game.all
	end

	def create
		@game = Game.create
		redirect_to game_path(@game)
	end

	def show	
		@game = Game.find(params[:id])
	end
end
