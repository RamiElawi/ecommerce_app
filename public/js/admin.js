const deleteProduct=(btn)=>{
    const prodId=btn.parentNode.querySelector('[name=Productid]').value
    const prodToken=btn.parentNode.querySelector('[name=_csrf]').value
    const productElement=btn.closest('article')

    fetch('/admin/product/'+prodId,{
        method:'DELETE',
        headers:{
            'csrf-token':prodToken
        }
    })
    .then(result=>{
        return result.json()
    })
    .then(data=>{
        productElement.parentNode.removeChild(productElement)
    })
    .catch(err=>{
        console.log(err)
    })
}