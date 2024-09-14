defmodule Demo.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Demo.Address

  embedded_schema do
    field :name, :string
    embeds_one :address, Address
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name])
    |> validate_required([:name])
    |> validate_length(:name, min: 3)
    |> cast_embed(:address, with: &Address.changeset/2, required: true)
  end
end
