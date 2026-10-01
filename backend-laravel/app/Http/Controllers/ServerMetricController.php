<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServerMetricsRequest;
use App\Models\ServerMetric;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ServerMetricController extends Controller
{
    //
    public function store(ServerMetricsRequest $request){
        $data = $request->validated();
        $data['timestamp'] = Carbon::parse($data['timestamp'])->toDateTimeString();

        $metric = ServerMetric::create($data);

        return response()->noContent();
    }

    public function index (){
        $metrics = ServerMetric::orderBy('timestamp', 'desc')->take(60)->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $metrics
        ]);
    }
}
