defmodule Demo.Address do
  use Ecto.Schema
  import Ecto.Changeset

  embedded_schema do
    field :street, :string
    field :city, :string
  end

  def changeset(address, attrs) do
    address
    |> cast(attrs, [:street, :city])
    |> validate_required([:street, :city])
  end
end
