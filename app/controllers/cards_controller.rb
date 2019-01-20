class CardsController < ApplicationController
	
	def index
		@game = Game.find(params[:game_id])
		render json: @game.cards
	end

	def update
		@card = Card.find(params[:id])
		@card.update_attributes(card_params)
		render json: @card
	end

	private

    def card_params
      params.require(:card).permit(:held_by, :face_up)
    end
end
