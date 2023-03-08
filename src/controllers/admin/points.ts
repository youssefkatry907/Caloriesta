import { resTypes } from "../../helpers/responseTypes";
import { create, update, remove, list, get, addMeal, removeMeal } from "../../modules/PointOfSale/repo";
import { Request, Response } from "express";


export async function listPointsOfSales(req: Request, res: Response) {
    let results = await list(); 
    res.json(resTypes(200, { records: results }));
}


export async function getPointOfSale(req: Request, res: Response) {
    const result = await get(req.params.id);
    if (result.success) res.json(resTypes(200, { record: result.record }));
    else res.json(resTypes(400, { errors: result.errors }));
}


export async function createPointOfSale(req: Request, res: Response) {
    const result = await create(req.body);
    if (result.success) {
        await result.record.save();
        res.json(resTypes(201, { record: result.record }));

    } else res.json(resTypes(400, { errors: result.errors }));
}


export async function updatePointOfSale(req: Request, res: Response) {
    const result = await update(req.params.id, req.body);
    if (result.success) {
        res.json(resTypes(201, { record: result.record }));
    } else res.json(resTypes(400, { errors: result.errors }));
}


export async function deletePointOfSale(req: Request, res: Response) {
    const result = await remove(req.params.id);

    if (result.success) {
        res.json(resTypes(201, { record: result.record }));
    } else res.json(resTypes(400, { errors: result.errors }));
}


export async function addMealToPoint(req: Request, res: Response) {
    let pointId = req.params.pointId;
    let mealId = req.params.mealId;

    const result = await addMeal(pointId, mealId);
    if (result.success) {
        await result.record.save();
        res.json(resTypes(201, { record: result.record }));

    } else res.json(resTypes(400, { errors: result.errors }));
}


export async function removeMealFromPoint(req: Request, res: Response) {
    let pointId = req.params.pointId;
    let mealId = req.params.mealId;

    const result = await removeMeal(pointId, mealId);
    if (result.success) {
        await result.record.save();
        res.json(resTypes(201, { record: result.record }));

    } else res.json(resTypes(400, { errors: result.errors }));
}