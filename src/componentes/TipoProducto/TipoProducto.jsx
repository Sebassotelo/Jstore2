import ContextGeneral from "@/servicios/contextPrincipal";
import React, { useContext } from "react";
import style from "./TipoProducto.module.scss";

import { doc, getDoc, updateDoc } from "firebase/firestore";

import { MdOutlineDeleteOutline } from "react-icons/md";
function TipoProducto() {
  const context = useContext(ContextGeneral);
  const { setTipoProductos, setProductos } = useContext(ContextGeneral);

  const nuevoTipoProducto = async (e) => {
    e.preventDefault(e);

    const tipo = e.target.inputTipoProducto.value;

    //traemos los datos de base de datos
    const docRef = doc(context.firestore, `users/sebassotelo97@gmail.com`);
    const consulta = await getDoc(docRef);
    const infoDocu = consulta.data();

    const newArray = [];

    newArray.push(...infoDocu.tipoProducto, tipo);

    await updateDoc(docRef, { tipoProducto: [...newArray] });
    setTipoProductos(newArray);
    e.target.inputTipoProducto.value = "";
  };

  const filtrarTipoProducto = (id) => {
    const nuevoArray = context.productosCopia.filter(
      (item) => item.tipoProducto == id
    );
    setProductos(nuevoArray);
  };

  const eliminarTipoProducto = async (id) => {
    if (
      confirm(`Seguro que desea eliminar el tipo de producto ${id} ?`) === true
    ) {
      const nuevoArray = context.tipoProductos.filter((item) => item != id);

      setTipoProductos(nuevoArray);

      const docRef = doc(context.firestore, `users/sebassotelo97@gmail.com`);
      await updateDoc(docRef, { tipoProducto: [...nuevoArray] });
    }
  };

  return (
    <div className={style.container}>
      <form action="" onSubmit={nuevoTipoProducto}>
        <p>Nombre de tipo de producto:</p>
        <input
          type="text"
          id="inputTipoProducto"
          placeholder="Ingrese el nombre del tipo de producto"
        />
        <button type="submit">Agregar Tipo Producto</button>
      </form>

      <div className={style.secciones}>
        {context.tipoProductos.map((item, i) => {
          return (
            <div className={style.secciones__item} key={i}>
              <p
                className={style.secciones__p}
                onClick={() => filtrarTipoProducto(item)}
              >
                {item}
              </p>
              <div
                className={style.x}
                onClick={() => eliminarTipoProducto(item)}
              >
                <MdOutlineDeleteOutline />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TipoProducto;
