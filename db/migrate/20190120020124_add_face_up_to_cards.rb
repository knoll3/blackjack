class AddFaceUpToCards < ActiveRecord::Migration[5.2]
  def change
  	add_column :cards, :face_up, :boolean
  end
end
