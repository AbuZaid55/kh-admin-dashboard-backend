const calculateTotalPrice = (product) => {
    const prices = [];
  
    const pearlCost = product.pearl_cost ? product.pearl_cost : 0;
    const laborCost = product.labor ? product.labor.price * product.total_gold_weight : 0;
    const extraCost = product.extra_cost ? product.extra_cost : 0;
    const extraFee = product.extra_fee ? product.extra_fee : 0;
    const gemstonePrice = product.gemstone_price ? product.gemstone_price : 0;
    const diamond_discount = product.diamond_discount?.percent ? product.diamond_discount.percent : 0;
    const gold_discount = product.gold_discount?.percent ? product.gold_discount.percent : 0;
    const gst = product.gst_percent ? product.gst_percent : 0;
    const discount_on_total = product.discount_on_total?.percent ? product.discount_on_total.percent : 0;
  
    const goldList = [];
  
    product.golds.map((gold) => {
      const carat = gold.carat;
      const price = gold.pricePerGram * product.total_gold_weight;
      const m_charge = gold.making_charge ? gold.making_charge.percent : 0;
      const w_charge = gold.wastage_charge ? gold.wastage_charge.percent : 0;
      const makingCharge = Math.round((price * m_charge) / 100);
      const wastageCharge = Math.round((price * w_charge) / 100);
      goldList.push({ carat: carat, price: price, makingCharge: makingCharge, wastageCharge: wastageCharge });
    });
  
    const diamondGrade = [];
    const diamondPrice = [];
    const totalDiamondWeight = [];
  
    product.diamonds?.map((obj) => {
      const grade = obj.diamond?.grade;
      if (!diamondGrade.includes(grade)) {
        diamondGrade.push(grade);
      }
    });
  
    diamondGrade.map((grade) => {
      let _totalDiamondWeight = 0;
      let price = 0;
      product.diamonds?.map((obj) => {
        if (grade === obj.diamond?.grade) {
          obj.pcs?.map((pcs) => {
            obj.diamond?.priceRanges.map((range) => {
              if (pcs.weight / pcs.count >= range.minCts && pcs.weight / pcs.count <= range.maxCts) {
                price = price + (pcs.weight / pcs.count) * range.pricePerGram * pcs.count;
                _totalDiamondWeight = parseFloat((_totalDiamondWeight + pcs.weight).toFixed(3));
              }
            });
          });
        }
      });
      totalDiamondWeight.push(_totalDiamondWeight);
      diamondPrice.push(price);
    });
  
    diamondGrade.map((grade, diamondIndex) => {
      goldList.map((gold) => {
        const diamondprice = Math.round(diamondPrice[diamondIndex]);
        const goldprice = Math.round(gold.price);
        const makingCharge = Math.round(gold.makingCharge);
        const wastageCharge = Math.round(gold.wastageCharge)
        const diamondPriceAfterDiscount = Math.round(diamondprice - diamondprice * (diamond_discount / 100))
        const goldPriceAfterDiscount = Math.round(goldprice - goldprice * (gold_discount / 100));
        const subTotal = Math.round(goldPriceAfterDiscount + diamondPriceAfterDiscount + gemstonePrice + pearlCost + extraCost + extraFee + laborCost + makingCharge + wastageCharge)
        const totalAfterDiscount = Math.round(subTotal - subTotal * (discount_on_total / 100));
        const gstAmount = Math.round(totalAfterDiscount * (gst / 100));
        const finalTotalPrice = Math.round(totalAfterDiscount + gstAmount);
        const totalPriceBeforeDiscount = Math.round(diamondprice + goldprice + makingCharge + wastageCharge + gemstonePrice + pearlCost + extraCost + extraFee + laborCost + gstAmount)
        prices.push({
          carat: gold.carat,
          grade: grade,
          totalDiamondWeight: totalDiamondWeight[diamondIndex],
          total_gold_weight: product.total_gold_weight,
          makingCharge,
          wastageCharge,
          laborCost,
          pearlCost,
          extraFee,
          extraCost,
          diamond_discount,
          gold_discount,
          discount_on_total,
          gst,
          goldprice,
          diamondprice,
          goldPriceAfterDiscount,
          diamondPriceAfterDiscount,
          subTotal,
          totalAfterDiscount,
          gstAmount,
          finalTotalPrice,
          totalPriceBeforeDiscount,
        });
      });
    });
    return prices;
  };

module.exports = calculateTotalPrice;